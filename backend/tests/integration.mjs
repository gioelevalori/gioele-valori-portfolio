import assert from 'node:assert/strict';
const base=process.env.SPAZIO_TEST_URL??'http://127.0.0.1:5080';
async function call(path,method='GET',body,token){return fetch(base+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:body===undefined?undefined:JSON.stringify(body)});}
async function account(){const email=crypto.randomUUID()+'@spazio.demo.invalid',password=crypto.randomUUID()+'Aa1!';assert.equal((await call('/api/auth/register','POST',{email,password})).status,200);const login=await call('/api/auth/login','POST',{email,password});assert.equal(login.status,200);return (await login.json()).accessToken;}
const health=await call('/health');assert.equal(health.status,200);assert.equal((await health.json()).storage,'PostgreSQL');
assert.equal((await call('/api/tasks/')).status,401);
const a=await account(),b=await account();
const input={title:'Integration test '+crypto.randomUUID(),tag:'Backend',state:'Da fare',due:'2026-12-01'};
const created=await call('/api/tasks/','POST',input,a);assert.equal(created.status,201);const task=await created.json();
assert.equal((await (await call('/api/tasks/','GET',undefined,a)).json()).length,1);
assert.equal((await (await call('/api/tasks/','GET',undefined,b)).json()).length,0);
assert.equal((await call('/api/tasks/'+task.id,'PATCH',{state:'Completate'},b)).status,404);
assert.equal((await call('/api/tasks/'+task.id,'DELETE',undefined,b)).status,404);
assert.equal((await call('/api/tasks/'+task.id,'PATCH',{state:'Unknown'},a)).status,400);
for(const invalid of [{...input,title:' '},{...input,title:'x'.repeat(91)},{...input,due:'2026-99-99'}])assert.equal((await call('/api/tasks/','POST',invalid,a)).status,400);
const changed=await call('/api/tasks/'+task.id,'PATCH',{state:'Completate'},a);assert.equal(changed.status,200);assert.equal((await changed.json()).state,'Completate');
assert.equal((await call('/api/tasks/'+task.id,'DELETE',undefined,a)).status,204);
assert.equal((await call('/api/tasks/'+task.id,'DELETE',undefined,a)).status,404);
const reset=await call('/api/tasks/reset','POST',undefined,a);assert.equal(reset.status,200);assert.equal((await reset.json()).length,4);
assert.equal((await (await call('/api/tasks/','GET',undefined,b)).json()).length,0);
console.log('PASS: PostgreSQL health, bearer authentication, CRUD, input validation, private boards and reset isolation.');
