from PIL import Image,ImageDraw
from pathlib import Path
files=list(Path('assets').glob('*.webp'))
out=Image.new('RGB',(1200,((len(files)+2)//3)*260),'#eee');d=ImageDraw.Draw(out)
for i,f in enumerate(files):
 im=Image.open(f);im.thumbnail((390,225));x=(i%3)*400;y=(i//3)*260;out.paste(im,(x,y+25));d.text((x+8,y+5),f.stem,fill='black')
out.save('tmp/crops.jpg')
