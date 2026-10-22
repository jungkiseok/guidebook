import pdfplumber,json,pypdfium2 as pdfium
from pathlib import Path
from PIL import Image,ImageDraw
src=r'C:/Users/jaseng/Documents/2026/guide_1/Guide.pdf'
records=[];doc=pdfium.PdfDocument(src)
with pdfplumber.open(src) as pdf:
 for n,p in enumerate(pdf.pages,1):
  for j,a in enumerate(p.images):
   x0,y0,x1,y1=a['x0'],a['top'],a['x1'],a['bottom']
   if x1-x0<35 or y1-y0<35:continue
   records.append(dict(n=n,j=j,box=[x0,y0,x1,y1],w=p.width,h=p.height))
Path('tmp/photo-objects.json').write_text(json.dumps(records),encoding='utf-8')
for start in range(0,len(records),40):
 canvas=Image.new('RGB',(1200,1600),'#eee');d=ImageDraw.Draw(canvas)
 for k,r in enumerate(records[start:start+40]):
  im=doc[r['n']-1].render(scale=1).to_pil();w,h=im.size
  im=im.crop(tuple(int(v*(w/r['w'] if i%2==0 else h/r['h'])) for i,v in enumerate(r['box'])))
  im.thumbnail((230,170));x=k%5*240;y=k//5*200
  canvas.paste(im,(x,y+25));d.text((x+4,y+4),f"{start+k}: p{r['n']} obj{r['j']}",fill='black')
 canvas.save(f'tmp/objects-{start}.jpg')
print(len(records))
