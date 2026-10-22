from PIL import Image,ImageOps,ImageDraw
for start in range(1,55,6):
 canvas=Image.new('RGB',(1600,1800),'#ddd');d=ImageDraw.Draw(canvas)
 for j,n in enumerate(range(start,min(start+6,55))):
  im=Image.open(f'tmp/spread-{n:02}.jpg');im.thumbnail((790,560));x=(j%2)*800;y=(j//2)*600
  canvas.paste(im,(x,y+25));d.text((x+10,y+5),str(n),fill='black')
 canvas.save(f'tmp/contact-{start}.jpg')
