const fs = require('fs');
const vm = require('vm');
const assert = require('assert/strict');
class El {
  constructor(){this.handlers={};this.attrs={};this.hidden=false;this.inert=false;this.open=false;}
  addEventListener(k,f){(this.handlers[k]??=[]).push(f)}
  fire(k,e={}){for(const f of this.handlers[k]||[])f(e)}
  setAttribute(k,v){this.attrs[k]=v}
  removeAttribute(k){delete this.attrs[k]}
  focus(){document.activeElement=this}
  getClientRects(){return [1]}
}
const nodes=Object.fromEntries(['#sidebar','#menu-open','#menu-close','.overlay','.content-shell','.mobile-bar','.print-button'].map(k=>[k,new El()]));
const link=new El(),active=new El(),form=new El(),status=new El(),detail1=new El(),detail2=new El();
detail2.open=true;active.scrollIntoView=()=>{};
nodes['#sidebar'].querySelectorAll=sel=>sel==='a'?[link]:[link,nodes['#menu-close']];
nodes['#sidebar'].querySelector=()=>active;
form.count=0;form.querySelector=()=>status;form.querySelectorAll=()=>Array(form.count).fill({});
form.reset=()=>{form.count=0;form.fire('reset')};
const classSet=new Set();
const document=new El();document.body={classList:{toggle:(k,v)=>v?classSet.add(k):classSet.delete(k),contains:k=>classSet.has(k)}};
document.activeElement=nodes['#menu-open'];document.querySelector=s=>nodes[s];
document.getElementById=id=>nodes['#'+id];
document.querySelectorAll=s=>s==='.checklist'?[form]:[detail1,detail2].filter(d=>!d.open);
const window=new El();let printed=false;window.print=()=>printed=true;
const media=new El();media.matches=true;
vm.runInNewContext(fs.readFileSync('common.js','utf8'),{document,window,matchMedia:()=>media});
nodes['#menu-open'].fire('click');assert(classSet.has('menu-visible'));assert(nodes['.content-shell'].inert);assert.equal(document.activeElement,nodes['#menu-close']);
document.fire('keydown',{key:'Escape',preventDefault(){}});assert(!classSet.has('menu-visible'));assert(!nodes['.content-shell'].inert);assert.equal(document.activeElement,nodes['#menu-open']);
nodes['#menu-open'].fire('click');link.fire('click');assert(!classSet.has('menu-visible'));
nodes['#menu-open'].fire('click');nodes['.overlay'].fire('click');assert(!classSet.has('menu-visible'));
nodes['#menu-open'].fire('click');nodes['#menu-close'].fire('click');assert(!classSet.has('menu-visible'));
nodes['#menu-open'].fire('click');document.activeElement=nodes['#menu-close'];let prevented=false;
document.fire('keydown',{key:'Tab',shiftKey:false,preventDefault(){prevented=true}});assert(prevented);assert.equal(document.activeElement,link);
media.matches=false;media.fire('change');assert(!classSet.has('menu-visible'));
window.fire('beforeprint');assert(detail1.open&&detail2.open);window.fire('afterprint');assert(!detail1.open&&detail2.open);
nodes['.print-button'].fire('click');assert(printed);
form.count=4;form.fire('change');assert.equal(status.textContent,'4 / 10 항목 선택');form.reset();assert.equal(status.textContent,'선택을 초기화했습니다.');
console.log('PASS: menu open / close / Esc / overlay / link / focus loop / breakpoint; print expand-restore; checklist status-reset. DOM mock, not browser layout verification.');
