import pdfplumber,pypdfium2 as pdfium,json
from pathlib import Path
src=r'C:/Users/jaseng/Documents/2026/guide_1/Guide.pdf'
doc=pdfium.PdfDocument(src)
with pdfplumber.open(src) as pdf:
 data=[]
 for i,p in enumerate(pdf.pages):
  w,h=p.width,p.height
  sides=[p.crop((0,0,w/2,h)),p.crop((w/2,0,w,h))]
  text='\n--- RIGHT ---\n'.join(s.extract_text(layout=False) or '' for s in sides)
  data.append({'page':i+1,'w':w,'h':h,'text':text})
  doc[i].render(scale=1).to_pil().save(f'tmp/spread-{i+1:02}.jpg')
 Path('tmp/extracted.json').write_text(json.dumps(data,ensure_ascii=False),encoding='utf-8')
 Path('tmp/all.txt').write_text('\n\n'.join(f'=== SPREAD {p["page"]} ===\n{p["text"]}' for p in data),encoding='utf-8')
 print('spreads',len(data));print('\n'.join(f'{p["page"]}: {p["text"][:130]}' for p in data))
