import { HOME_SCHEMA } from './home-schema';
import { SpazioApiService, SpazioTask } from './spazio-api.service';
import { ProjectSelectionService } from './project-selection.service';
import { ScrollRevealDirective } from './scroll-reveal.directive';
import { RouterLink } from '@angular/router';
import { PROJECTS, SERVICES, GUARANTEES, JOBS, SKILLS } from './portfolio-data';
import { ENGLISH } from './translations';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { AfterViewInit, ChangeDetectorRef, Component, computed, inject, HostListener, OnDestroy, signal } from '@angular/core';
import { ProjectPreviewComponent } from './project-preview.component';

type TaskState = 'Da fare' | 'In corso' | 'Completate';
type DemoTask=SpazioTask;

@Component({selector:'app-home',standalone:true,imports:[ProjectPreviewComponent,RouterLink,ScrollRevealDirective],templateUrl:'./app.component.html'})
export class App implements AfterViewInit, OnDestroy {
 private readonly browser=isPlatformBrowser(inject(PLATFORM_ID));
 galleryUrl(){return this.language()==='en'?'/en/projects/':'/progetti/';}
 studyUrl(index:number){return (this.language()==='en'?'/en/projects/':'/progetti/')+this.projects[index].slug+'/';}
 language=signal<'it'|'en'>('it');
 private loadLanguage():'it'|'en'{const requested=new URLSearchParams(location.search).get('lang');if(requested==='it'||requested==='en')return requested;try{return localStorage.getItem('gv-portfolio-language')==='en'?'en':'it';}catch{return 'it';}}
 setLanguage(language:'it'|'en'){if(language===this.language())return;this.transition(()=>this.applyLanguage(language));}
 private applyLanguage(language:'it'|'en'){this.language.set(language);const url=new URL(location.href);if(url.searchParams.has('lang')){url.searchParams.set('lang',language);history.replaceState(history.state,'',url);} try{localStorage.setItem('gv-portfolio-language',language);}catch{}this.updateLanguageMetadata();}
 private updateLanguageMetadata(){
   const english=this.language()==='en';
   const title=english?'Gioele Valori — Full-Stack Developer | Websites & Web Apps':'Gioele Valori — Sviluppatore Full Stack Angular e C#/.NET';
   const description=english?'Angular and C#/.NET full-stack developer. Professional experience and projects built from the client’s idea to the live website.':'Sviluppatore full-stack Angular e C#/.NET. Esperienza aziendale e progetti realizzati dall’idea del cliente al sito online.';
   document.documentElement.lang=this.language();document.title=title;
   for(const selector of ['meta[name="description"]','meta[property="og:description"]','meta[name="twitter:description"]'])document.querySelector(selector)?.setAttribute('content',description);
   for(const selector of ['meta[property="og:title"]','meta[name="twitter:title"]'])document.querySelector(selector)?.setAttribute('content',title);
   document.querySelector('meta[property="og:locale"]')?.setAttribute('content',english?'en_GB':'it_IT');
   document.querySelector('link[rel="canonical"]')?.setAttribute('href','https://gioelevalori.dev/');
   document.querySelector('meta[property="og:url"]')?.setAttribute('content','https://gioelevalori.dev/');
   for(const selector of ['meta[property="og:image"]','meta[name="twitter:image"]'])document.querySelector(selector)?.setAttribute('content','https://gioelevalori.dev/social-card.png');
   document.querySelector('meta[property="og:type"]')?.setAttribute('content','website');
   document.querySelector('meta[property="og:image:width"]')?.setAttribute('content','1200');document.querySelector('meta[property="og:image:height"]')?.setAttribute('content','630');
   document.querySelector('meta[property="og:image:alt"]')?.setAttribute('content','Gioele Valori — Angular e C#/.NET');
   document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el=>el.remove());
   const structured=document.querySelector('script[type="application/ld+json"]');if(structured)structured.textContent=JSON.stringify(HOME_SCHEMA);
 }

 t(value:unknown):string{const text=value==null?'':String(value);if(this.language()==='it')return text;const exact=ENGLISH[text];if(exact!==undefined)return exact;for(const [it,en]of [['Attività aggiunta: ','Task added: '],['Elimina attività: ','Delete task: '],['Stato di ','Status of '],['Scadenza · ','Due · '],['Scopri ','Explore '],['Screenshot del sito ','Screenshot of '],['Un’anteprima del sito ','A preview of ']]){if(text.startsWith(it))return en+text.slice(it.length);}if(text.startsWith('Attività spostata in '))return 'Task moved to '+this.t(text.slice('Attività spostata in '.length,-1))+'.';return text;}
 taskCount(count:number){return this.language()==='en'?count+' '+(count===1?'task':'tasks'):count+' attività';}

 api=inject(SpazioApiService);
 async connectApi(){await this.apiAction(()=>this.api.connect());}
 useBrowserDemo(){this.api.disconnect();this.demoTasks.set(this.loadDemo());}
 private async apiAction(action:()=>Promise<DemoTask[]>){if(this.api.busy())return false;this.api.busy.set(true);this.api.error.set(false);try{const tasks=await action();this.demoTasks.set(tasks);return true;}catch{this.api.error.set(true);if(!this.api.connected())this.demoTasks.set(this.loadDemo());return false;}finally{this.api.busy.set(false);}}
 menuOpen=signal(false);
 closeMenu(){this.menuOpen.set(false);}
 @HostListener('document:keydown.escape') escapeMenu(){if(this.menuOpen()){this.closeMenu();document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus();}}
 private readonly cdr=inject(ChangeDetectorRef);

 readonly states: TaskState[]=['Da fare','In corso','Completate'];
 demoOpen=signal(false); projectView=signal<'demo'|'details'>('demo'); showTaskForm=signal(false);
 query=signal('');stateFilter=signal('Tutte');dragOver=signal('');demoMessage=signal('');storageAvailable=signal(true);
 private lastFocus: HTMLElement|null=null; private oldOverflow=''; private readonly storageKey='gv-spazio-demo-v1';
 demoTasks=signal<DemoTask[]>(this.sampleTasks());
 filteredTasks=computed(()=>this.demoTasks().filter(task=>(this.stateFilter()==='Tutte'||task.state===this.stateFilter())&&[task.title,task.tag,(task.id.startsWith('sample-')||task.sample)?this.t(task.title):'',this.t(task.tag)].join(' ').toLocaleLowerCase('it').includes(this.query().trim().toLocaleLowerCase('it'))));
 inputValue(event:Event){return (event.target as HTMLInputElement).value;}
 tasksFor(state:TaskState){return this.filteredTasks().filter(task=>task.state===state);}
 private sampleTasks():DemoTask[]{return [
 {id:'sample-1',title:'Disegnare la pagina profilo',tag:'Design',state:'Da fare',due:''},
 {id:'sample-2',title:'Preparare i componenti Angular',tag:'Frontend',state:'Da fare',due:''},
 {id:'sample-3',title:'Sviluppare la bacheca',tag:'Frontend',state:'In corso',due:''},
 {id:'sample-4',title:'Definire i colori del progetto',tag:'Design',state:'Completate',due:''}
 ];}
 private loadDemo():DemoTask[]{if(!this.browser)return this.sampleTasks();try{const raw=localStorage.getItem(this.storageKey);if(!raw)return this.sampleTasks();const data:unknown=JSON.parse(raw);if(!Array.isArray(data)||data.length>200)throw Error('Invalid data');const valid=data.every(t=>t&&typeof t.id==='string'&&typeof t.title==='string'&&t.title.length>0&&t.title.length<=90&&typeof t.tag==='string'&&t.tag.length<=30&&['Da fare','In corso','Completate'].includes(t.state)&&typeof t.due==='string'&&(!t.due||/^\d{4}-\d{2}-\d{2}$/.test(t.due)));if(!valid||new Set(data.map(t=>t.id)).size!==data.length)throw Error('Invalid data');return data as DemoTask[];}catch{this.storageAvailable.set(false);return this.sampleTasks();}}
 private saveDemo(){try{localStorage.setItem(this.storageKey,JSON.stringify(this.demoTasks()));this.storageAvailable.set(true);}catch{this.storageAvailable.set(false);}}
 private transition(update:()=>void){const doc=document as Document & {startViewTransition?:(callback:()=>Promise<void>)=>{finished:Promise<void>;ready:Promise<void>;updateCallbackDone:Promise<void>}};if(doc.startViewTransition&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const result=doc.startViewTransition(async()=>{update();this.cdr.detectChanges();});void result.finished.catch(()=>{});void result.ready.catch(()=>{});void result.updateCallbackDone.catch(()=>{});}else{update();this.cdr.detectChanges();if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.querySelector('.project:not([hidden])')?.animate([{opacity:.65,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.22,.61,.36,1)'});}}}
 openDemo(event?:Event){event?.preventDefault();if(this.demoOpen())return;this.lastFocus=document.activeElement as HTMLElement;this.oldOverflow=document.body.style.overflow;this.projectView.set('demo');this.transition(()=>this.showDemo());}
 private showDemo(){this.demoOpen.set(true);document.body.style.overflow='hidden';document.querySelector<HTMLDialogElement>('.project-dialog')?.showModal();}
 closeDemo(event?:Event){event?.preventDefault();this.transition(()=>document.querySelector<HTMLDialogElement>('.project-dialog')?.close());}
 afterDemoClosed(){const url=new URL(location.href);if(url.searchParams.has('demo')){url.searchParams.delete('demo');history.replaceState(history.state,'',url);}this.demoOpen.set(false);document.body.style.overflow=this.oldOverflow;this.showTaskForm.set(false);this.lastFocus?.focus({preventScroll:true});}
 cancelDemo(event:Event){event.preventDefault();this.closeDemo();}
 backdropClick(event:MouseEvent){if(event.target===event.currentTarget)this.closeDemo();}
 async addTask(event:Event,title:string,tag:string,due:string){event.preventDefault();const clean=title.trim();if(!clean){this.demoMessage.set('Scrivi un nome per l’attività.');return;}if(this.demoTasks().length>=200){this.demoMessage.set('La demo contiene già 200 attività. Eliminane una prima di aggiungerne altre.');return;}if(this.api.connected()){if(await this.apiAction(()=>this.api.add({title:clean.slice(0,90),tag,state:'Da fare',due}))){this.query.set('');this.stateFilter.set('Tutte');this.showTaskForm.set(false);this.demoMessage.set('Attività aggiunta: '+clean);}return;}this.demoTasks.update(tasks=>[...tasks,{id:crypto.randomUUID(),title:clean.slice(0,90),tag,state:'Da fare',due}]);this.query.set('');this.stateFilter.set('Tutte');this.showTaskForm.set(false);this.saveDemo();this.demoMessage.set('Attività aggiunta: '+clean);}
 async changeTaskState(id:string,state:string){if(!this.states.includes(state as TaskState))return;if(this.api.connected()){await this.apiAction(()=>this.api.changeState(id,state));return;}this.demoTasks.update(tasks=>tasks.map(t=>t.id===id?{...t,state:state as TaskState}:t));this.saveDemo();this.demoMessage.set('Attività spostata in '+state+'.');}
 async deleteTask(id:string){if(this.api.connected()){await this.apiAction(()=>this.api.remove(id));return;}this.demoTasks.update(tasks=>tasks.filter(t=>t.id!==id));this.saveDemo();this.demoMessage.set('Attività eliminata.');}
 async resetDemo(){if(this.api.connected()){if(await this.apiAction(()=>this.api.reset())){this.query.set('');this.stateFilter.set('Tutte');}return;}this.demoTasks.set(this.sampleTasks());this.query.set('');this.stateFilter.set('Tutte');this.saveDemo();this.demoMessage.set('Bacheca di esempio ripristinata.');}
 startDrag(event:DragEvent,id:string){event.dataTransfer?.setData('text/plain',id);if(event.dataTransfer)event.dataTransfer.effectAllowed='move';}
 allowDrop(event:DragEvent,state:TaskState){event.preventDefault();this.dragOver.set(state);if(event.dataTransfer)event.dataTransfer.dropEffect='move';}
 dropTask(event:DragEvent,state:TaskState){event.preventDefault();const id=event.dataTransfer?.getData('text/plain');if(id&&this.demoTasks().some(t=>t.id===id))this.changeTaskState(id,state);this.dragOver.set('');}
 formatDue(value:string){const [year,month,day]=value.split('-').map(Number);return new Intl.DateTimeFormat(this.language()==='en'?'en-GB':'it-IT').format(new Date(year,month-1,day));}

 private frame=0;
 ngAfterViewInit(){
   if(!this.browser)return;
   this.language.set(this.loadLanguage());
   this.demoTasks.set(this.loadDemo());
   this.cdr.detectChanges();
   this.updateLanguageMetadata();
   void this.api.configure().then(()=>{if(this.api.connected())return this.apiAction(()=>this.api.list());return undefined;});
   this.updateScene();
   if(new URLSearchParams(location.search).get('demo')==='spazio'){this.featuredIndex.set(this.projects.findIndex(p=>p.slug==='spazio'));this.oldOverflow=document.body.style.overflow;this.showDemo();this.cdr.detectChanges();this.lastFocus=document.querySelector<HTMLElement>('.project-selected .project-demo-link');}
 }
 @HostListener('window:scroll') onScroll(){if(!this.frame)this.frame=requestAnimationFrame(()=>{this.updateScene();this.frame=0;});}
 @HostListener('window:resize') onResize(){this.updateScene();}
 private updateScene(){
   if(CSS.supports('animation-timeline: scroll()'))return;
   const reading=document.querySelector<HTMLElement>('.reading-progress');
   if(!reading)return;
   const distance=document.documentElement.scrollHeight-innerHeight;
   reading.style.setProperty('--reading-progress',String(distance>0?Math.max(0,Math.min(1,scrollY/distance)):0));
 }
 tiltCover(event:PointerEvent){if(event.pointerType!=='mouse'||innerWidth<800||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const el=event.currentTarget as HTMLElement;const r=el.getBoundingClientRect();el.style.setProperty('--tilt-x',((event.clientY-r.top)/r.height-.5)*-6+'deg');el.style.setProperty('--tilt-y',((event.clientX-r.left)/r.width-.5)*7+'deg');}
 resetCover(event:PointerEvent){const el=event.currentTarget as HTMLElement;el.style.setProperty('--tilt-x','0deg');el.style.setProperty('--tilt-y','0deg');}

 ngOnDestroy(){if(this.demoOpen())document.body.style.overflow=this.oldOverflow;if(this.frame)cancelAnimationFrame(this.frame);}

 light=signal(false); copied=signal(false); year=new Date().getFullYear();
 featuredIndex=inject(ProjectSelectionService).index;
 selectProject(index:number){if(!Number.isInteger(index)||index<0||index>=this.projects.length)return;if(index===this.featuredIndex())return;this.transition(()=>this.featuredIndex.set(index));}
 projectNumber(value:number){return String(value).padStart(2,'0');}
 toggleTheme(){this.transition(()=>this.light.set(!this.light()));}
 stepProject(direction:number){this.selectProject((this.featuredIndex()+direction+this.projects.length)%this.projects.length);}

 projects=PROJECTS;
 services=SERVICES;
 guarantees=GUARANTEES;
 jobs=JOBS;
 skills=SKILLS;
 async copyEmail(){try{await navigator.clipboard.writeText('gioelevalori998@gmail.com');this.copied.set(true);setTimeout(()=>this.copied.set(false),3000);}catch{location.href='mailto:gioelevalori998@gmail.com';}}
}
