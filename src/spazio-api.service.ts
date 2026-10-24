import { Injectable, signal } from '@angular/core';
export interface SpazioTask {id:string;title:string;tag:string;state:'Da fare'|'In corso'|'Completate';due:string;sample?:boolean;}
@Injectable({providedIn:'root'})
export class SpazioApiService {
 readonly configured=signal(false);readonly connected=signal(false);readonly busy=signal(false);readonly error=signal(false);
 private base='';private token='';private expires=0;
 async configure(){try{const response=await fetch(new URL('spazio-config.json',document.baseURI));const config=await response.json();if(typeof config.apiUrl!=='string'||!config.apiUrl)return;const url=new URL(config.apiUrl);if(url.protocol!=='https:'&&!(url.protocol==='http:'&&['localhost','127.0.0.1'].includes(url.hostname)))return;this.base=url.href.replace(/\/$/,'');this.configured.set(true);try{const session=JSON.parse(sessionStorage.getItem('gv-spazio-api-session')??'null');if(session?.base===this.base&&session.expires>Date.now()){this.token=session.token;this.expires=session.expires;}}catch{}}catch{}}
 private async request(path:string,method='GET',body?:unknown,authenticated=true){const response=await fetch(this.base+path,{method,headers:{'Content-Type':'application/json',...(authenticated?{Authorization:'Bearer '+this.token}:{})},body:body===undefined?undefined:JSON.stringify(body)});if(!response.ok){if(response.status===401){this.token='';this.connected.set(false);try{sessionStorage.removeItem('gv-spazio-api-session');}catch{}}throw new Error('API request failed: '+response.status);}const text=await response.text();return text?JSON.parse(text):undefined;}
 async connect():Promise<SpazioTask[]>{if(!this.configured())throw new Error('API unavailable');if(!this.token||this.expires<Date.now()){
 const email=crypto.randomUUID()+'@spazio.demo.invalid';const password=crypto.randomUUID()+'Aa1!';
 await this.request('/api/auth/register','POST',{email,password},false);
 const login=await this.request('/api/auth/login','POST',{email,password},false);this.token=login.accessToken;this.expires=Date.now()+login.expiresIn*1000;
 try{sessionStorage.setItem('gv-spazio-api-session',JSON.stringify({base:this.base,token:this.token,expires:this.expires}));}catch{}
 const tasks=await this.request('/api/tasks/reset','POST');this.connected.set(true);return tasks;
 }const tasks=await this.list();this.connected.set(true);return tasks;}
 list():Promise<SpazioTask[]>{return this.request('/api/tasks/');}
 async add(task:Omit<SpazioTask,'id'>){await this.request('/api/tasks/','POST',task);return this.list();}
 async changeState(id:string,state:string){await this.request('/api/tasks/'+encodeURIComponent(id),'PATCH',{state});return this.list();}
 async remove(id:string){await this.request('/api/tasks/'+encodeURIComponent(id),'DELETE');return this.list();}
 reset():Promise<SpazioTask[]>{return this.request('/api/tasks/reset','POST');}
 disconnect(){this.connected.set(false);this.error.set(false);}
}
