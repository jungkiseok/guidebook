from pathlib import Path
import pypdfium2 as pdfium, shutil
doc=pdfium.PdfDocument(r'C:/Users/jaseng/Documents/2026/guide_1/Guide.pdf')
out=Path('assets');out.mkdir(exist_ok=True)
shutil.copyfile(r'C:/Users/jaseng/Documents/2026/guide_1/brand_page_logo2.svg',out/'logo.svg')
# Coordinates refer to the inspected 993 x 709 spread renders.
crops={
 'greeting-art':(42,(567,211,951,420)),
 'conversation-art':(43,(0,470,497,708)),
 'phone-art':(45,(0,85,497,409)),
 'messenger-art':(46,(0,85,497,434)),
 'email-art':(47,(0,316,497,708)),
 'emblem':(7,(567,490,951,611)),
 'chuna':(20,(42,140,425,390)),
 'chuna-lumbar':(20,(567,115,757,233)),
 'chuna-jaw':(20,(764,115,951,233)),
 'chuna-neck':(20,(567,310,757,428)),
 'chuna-joint':(20,(764,310,951,428)),
 'nerve':(23,(42,235,426,469)),
 'msat-lumbar':(23,(567,277,951,359)),
 'msat-joint':(23,(567,385,951,468)),
 'case-lumbar1':(25,(108,238,361,355)),
 'case-lumbar2':(25,(108,469,361,587)),
 'case-neck1':(25,(633,191,885,309)),
 'case-neck2':(25,(633,448,885,566)),
 'walk':(49,(567,255,951,385)),
 'stand':(49,(567,466,951,609)),
 'lift':(50,(42,109,426,313)),
 'sit':(50,(42,408,426,611)),
 'pillow':(50,(567,109,951,257)),
 'side-sleep':(50,(567,337,951,435)),
 'back-sleep':(50,(567,513,951,611)),
 'biocenter':(26,(42,145,426,440)),
 'quality':(27,(42,106,426,364)),
 'herb-inflammation':(21,(670,140,937,202)),
 'herb-bone':(21,(670,276,937,338)),
 'herb-nerve':(21,(670,422,937,483)),
 'herb-cartilage':(21,(670,562,937,622)),
 'academy':(30,(567,125,951,324)),
 'research':(8,(567,135,951,355)),
}
for name,(n,box) in crops.items():
 p=doc[n-1];im=p.render(scale=2.5).to_pil();w,h=im.size
 b=tuple(round(v*(w/993 if i%2==0 else h/709)) for i,v in enumerate(box))
 im.crop(b).save(out/(name+'.webp'),quality=92)
print('Saved',len(crops),'crops')
