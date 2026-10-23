const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const storage=new Map();let redirect='';const events={};
function el(){return {value:'',textContent:'',setAttribute(){},removeAttribute(){},focus(){},addEventListener(k,f){events[k]=f}}}
const nodes=Object.fromEntries(['login-form','employee-id','password','login-error'].map(k=>[k,el()]));
const sessionStorage={getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
const document={getElementById:k=>nodes[k],documentElement:{style:{}}};const window={location:{replace:p=>redirect=p}};
vm.runInNewContext(fs.readFileSync('auth.js','utf8'),{document,window,sessionStorage});assert.equal(redirect,'login.html');assert.equal(document.documentElement.style.visibility,'hidden');
vm.runInNewContext(fs.readFileSync('login.js','utf8'),{document,window,sessionStorage});
for(const [id,pw,ok] of [['M50278','bad',false],['wrong','1111',false],['m50278','1111',false],['M50278','1111',true]]){
 redirect='';nodes['employee-id'].value=id;nodes.password.value=pw;events.submit({preventDefault(){}});assert.equal(redirect,ok?'index.html':'');if(!ok)assert.equal(storage.size,0);
}
redirect='';document.documentElement.style={};vm.runInNewContext(fs.readFileSync('auth.js','utf8'),{document,window,sessionStorage});assert.equal(redirect,'');
sessionStorage.removeItem('jaseng-guide-session');vm.runInNewContext(fs.readFileSync('auth.js','utf8'),{document,window,sessionStorage});assert.equal(redirect,'login.html');
console.log('PASS: unauthenticated redirect, invalid credentials, exact credentials, authenticated access, removed session.');
