from pathlib import Path
from html.parser import HTMLParser
import zipfile
files=list(Path('.').glob('*.html'))+[Path('styles.css'),Path('common.js'),Path('작업완료보고.md')]
class P(HTMLParser):
 def handle_starttag(self,t,a):
  if t=='img':
   src=dict(a).get('src')
   if src: assets.add(Path(src))
assets=set()
for f in Path('.').glob('*.html'):P().feed(f.read_text(encoding='utf-8'))
files+=sorted(assets)
with zipfile.ZipFile('자생_가이드북.zip','w',zipfile.ZIP_DEFLATED) as z:
 for f in files:z.write(f,f.as_posix())
print('Archive:',len(files),'files;',len(assets),'image assets;',Path('자생_가이드북.zip').stat().st_size,'bytes')
