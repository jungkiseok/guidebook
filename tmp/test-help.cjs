const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const code=fs.readFileSync('common.js','utf8');
const handlers={};const status={};
const rows=Array.from({length:10},()=>({no:false,help:{hidden:false},querySelector(s){return s==='.answer-help'?this.help:(this.no?{}:null)}}));
const form={querySelector(){return status},querySelectorAll(s){return s==='fieldset'?rows:rows.filter(r=>r.selected)},reset(){rows.forEach(r=>{r.no=false;r.selected=false});handlers.reset?.()},addEventListener(k,f){handlers[k]=f}};
const document={querySelectorAll(){return [form]}};
const start=code.indexOf("  document.querySelectorAll('.checklist')");
vm.runInNewContext(code.slice(start,code.lastIndexOf('})();')),{document});
assert(rows.every(r=>r.help.hidden));
for(let i=0;i<10;i++){
 const row=rows[i];row.selected=true;row.no=true;handlers.change();assert(!row.help.hidden);
 assert(rows.every((r,j)=>j===i||r.help.hidden));
 row.no=false;handlers.change();assert(row.help.hidden);
 row.no=true;handlers.change();form.reset();assert(rows.every(r=>r.help.hidden&&!r.selected));
}
console.log('PASS: all 10 rows No show / Yes hide / reset hide; initial hidden; independent rows.');
