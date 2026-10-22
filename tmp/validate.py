from html.parser import HTMLParser
from pathlib import Path
import json
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.tags=[];self.text=[]
 def handle_starttag(self,t,a):self.tags.append((t,dict(a)))
 def handle_data(self,d):self.text.append(d)
errors=[];stats=[]
for f in Path('.').glob('*.html'):
 q=Parser();q.feed(f.read_text(encoding='utf-8'));ids=[a['id'] for t,a in q.tags if 'id' in a]
 if len(ids)!=len(set(ids)):errors.append(f'{f}: duplicate IDs')
 for t,a in q.tags:
  for key in ['href','src']:
   if key not in a:continue
   ref=a[key]
   if ref.startswith('#'):
    if ref[1:] not in ids:errors.append(f'{f}: missing anchor {ref}')
   elif not Path(ref).is_file():errors.append(f'{f}: missing relative file {ref}')
  if t=='img' and not a.get('alt'):errors.append(f'{f}: empty alt')
 if len([1 for t,a in q.tags if t=='h1'])!=1:errors.append(f'{f}: h1')
 if len([1 for t,a in q.tags if a.get('aria-current')=='page'])!=1:errors.append(f'{f}: current')
 radios=[a for t,a in q.tags if t=='input']
 if radios:
  if len(radios)!=20 or any('checked' in a for a in radios):errors.append(f'{f}: radio count or default')
  for i in range(1,11):
   group=[a for a in radios if a['name']==f'q{i}']
   if sorted(a['value'] for a in group)!=['no','yes']:errors.append(f'{f}: radio group {i}')
 stats.append({'file':str(f),'images':sum(t=='img' for t,a in q.tags),'radio_inputs':len(radios)})
result={'pages':len(stats),'errors':errors,'checks':['relative paths','all links and anchors','image files and alt text','one H1','active topic','checklist groups and unselected defaults'],'detail':stats}
Path('tmp/validation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'pages':len(stats),'errors':errors}))
