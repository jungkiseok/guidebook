from PIL import Image,ImageDraw
from pathlib import Path
files=list(Path('assets/photos').glob('*.webp'))
for start in range(0,len(files),25):
 out=Image.new('RGB',(1200,1250),'#eee');d=ImageDraw.Draw(out)
 for i,f in enumerate(files[start:start+25]):
  im=Image.open(f);im.thumbnail((230,218));x=i%5*240;y=i//5*250;out.paste(im,(x,y+25));d.text((x+5,y+5),f.stem,fill='black')
 out.save(f'tmp/newphotos-{start}.jpg')
