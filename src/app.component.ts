import { PROJECTS, SERVICES, GUARANTEES, JOBS, SKILLS } from './portfolio-data';
import { ENGLISH } from './translations';
import { AfterViewInit, ChangeDetectorRef, Component, computed, inject, HostListener, OnDestroy, signal } from '@angular/core';
import { ProjectPreviewComponent } from './project-preview.component';
import STUDIES from './content/project-studies.json';

type TaskState = 'Da fare' | 'In corso' | 'Completate';
interface DemoTask { id: string; title: string; tag: string; state: TaskState; due: string; }

@Component({selector:'app-root',standalone:true,imports:[ProjectPreviewComponent],templateUrl:'./app.component.html'})
export class App implements AfterViewInit, OnDestroy {
 studies=STUDIES;
 studyUrl(index:number){return (this.language()==='en'?'en/projects/':'progetti/')+this.studies[index].slug+'/';}
 language=signal<'it'|'en'>(this.loadLanguage());
 private loadLanguage():'it'|'en'{const requested=new URLSearchParams(location.search).get('lang');if(requested==='it'||requested==='en')return requested;try{return localStorage.getItem('gv-portfolio-language')==='en'?'en':'it';}catch{return 'it';}}
 setLanguage(language:'it'|'en'){this.language.set(language);const url=new URL(location.href);if(url.searchParams.has('lang')){url.searchParams.set('lang',language);history.replaceState(history.state,'',url);} try{localStorage.setItem('gv-portfolio-language',language);}catch{}this.updateLanguageMetadata();}
 private updateLanguageMetadata(){
   const english=this.language()==='en';
   const title=english?'Gioele Valori — Full-Stack Developer | Websites & Web Apps':'Gioele Valori — Full-Stack Developer | Siti Web & Applicazioni su Misura';
   const description=english?'Angular and C#/.NET full-stack developer. Professional experience and projects built from the client’s idea to the live website.':'Sviluppatore full-stack Angular e C#/.NET. Esperienza aziendale e progetti realizzati dall’idea del cliente al sito online.';
   document.documentElement.lang=this.language();document.title=title;
   for(const selector of ['meta[name="description"]','meta[property="og:description"]','meta[name="twitter:description"]'])document.querySelector(selector)?.setAttribute('content',description);
   for(const selector of ['meta[property="og:title"]','meta[name="twitter:title"]'])document.querySelector(selector)?.setAttribute('content',title);
   document.querySelector('meta[property="og:locale"]')?.setAttribute('content',english?'en_GB':'it_IT');
 }

 t(value:unknown):string{const text=value==null?'':String(value);if(this.language()==='it')return text;const exact=ENGLISH[text];if(exact!==undefined)return exact;for(const [it,en]of [['Attività aggiunta: ','Task added: '],['Elimina attività: ','Delete task: '],['Stato di ','Status of '],['Scadenza · ','Due · '],['Scopri ','Explore '],['Screenshot del sito ','Screenshot of '],['Un’anteprima del sito ','A preview of ']]){if(text.startsWith(it))return en+text.slice(it.length);}if(text.startsWith('Attività spostata in '))return 'Task moved to '+this.t(text.slice('Attività spostata in '.length,-1))+'.';return text;}
 taskCount(count:number){return this.language()==='en'?count+' '+(count===1?'task':'tasks'):count+' attività';}

 menuOpen=signal(false);
 closeMenu(){this.menuOpen.set(false);}
 @HostListener('document:keydown.escape') escapeMenu(){if(this.menuOpen()){this.closeMenu();document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus();}}
 caseIndex=signal(0);caseOpen=signal(false);
 caseProject=computed(()=>this.projects[this.caseIndex()]);
 projectFeatures=[
 ['Scegliere forma, dedica, immagini e colori del biscotto.','Visualizzare un’anteprima tridimensionale della personalizzazione.','Esplorare la galleria e le proposte per eventi.','Inviare richieste su misura e consultare il carrello.'],
 ['Conoscere l’Endurance Battle e le informazioni sulla gara.','Consultare categorie ed edizioni dell’evento.','Trovare risposte alle domande frequenti.','Accedere ai contatti, alla mappa e ai canali social.']
 ];
 openCase(index:number){if(index<0||index>1||this.caseOpen())return;this.lastFocus=document.activeElement as HTMLElement;this.oldOverflow=document.body.style.overflow;this.caseIndex.set(index);this.cdr.detectChanges();this.transition(()=>{this.caseOpen.set(true);this.cdr.detectChanges();document.body.style.overflow='hidden';document.querySelector<HTMLDialogElement>('.case-dialog')?.showModal();});}
 closeCase(event?:Event){event?.preventDefault();this.transition(()=>{document.querySelector<HTMLDialogElement>('.case-dialog')?.close();this.caseOpen.set(false);});}
 afterCaseClosed(){this.caseOpen.set(false);document.body.style.overflow=this.oldOverflow;this.lastFocus?.focus({preventScroll:true});}
 private readonly cdr=inject(ChangeDetectorRef);

 readonly states: TaskState[]=['Da fare','In corso','Completate'];
 demoOpen=signal(false); projectView=signal<'demo'|'details'>('demo'); showTaskForm=signal(false);
 query=signal('');stateFilter=signal('Tutte');dragOver=signal('');demoMessage=signal('');storageAvailable=signal(true);
 private lastFocus: HTMLElement|null=null; private oldOverflow=''; private readonly storageKey='gv-spazio-demo-v1';
 demoTasks=signal<DemoTask[]>(this.loadDemo());
 filteredTasks=computed(()=>this.demoTasks().filter(task=>(this.stateFilter()==='Tutte'||task.state===this.stateFilter())&&[task.title,task.tag,task.id.startsWith('sample-')?this.t(task.title):'',this.t(task.tag)].join(' ').toLocaleLowerCase('it').includes(this.query().trim().toLocaleLowerCase('it'))));
 inputValue(event:Event){return (event.target as HTMLInputElement).value;}
 tasksFor(state:TaskState){return this.filteredTasks().filter(task=>task.state===state);}
 private sampleTasks():DemoTask[]{return [
 {id:'sample-1',title:'Disegnare la pagina profilo',tag:'Design',state:'Da fare',due:''},
 {id:'sample-2',title:'Preparare i componenti Angular',tag:'Frontend',state:'Da fare',due:''},
 {id:'sample-3',title:'Sviluppare la bacheca',tag:'Frontend',state:'In corso',due:''},
 {id:'sample-4',title:'Definire i colori del progetto',tag:'Design',state:'Completate',due:''}
 ];}
 private loadDemo():DemoTask[]{try{const raw=localStorage.getItem(this.storageKey);if(!raw)return this.sampleTasks();const data:unknown=JSON.parse(raw);if(!Array.isArray(data)||data.length>200)throw Error('Invalid data');const valid=data.every(t=>t&&typeof t.id==='string'&&typeof t.title==='string'&&t.title.length>0&&t.title.length<=90&&typeof t.tag==='string'&&t.tag.length<=30&&['Da fare','In corso','Completate'].includes(t.state)&&typeof t.due==='string'&&(!t.due||/^\d{4}-\d{2}-\d{2}$/.test(t.due)));if(!valid||new Set(data.map(t=>t.id)).size!==data.length)throw Error('Invalid data');return data as DemoTask[];}catch{this.storageAvailable.set(false);return this.sampleTasks();}}
 private saveDemo(){try{localStorage.setItem(this.storageKey,JSON.stringify(this.demoTasks()));this.storageAvailable.set(true);}catch{this.storageAvailable.set(false);}}
 private transition(update:()=>void){const doc=document as Document & {startViewTransition?:(callback:()=>Promise<void>)=>{finished:Promise<void>;ready:Promise<void>;updateCallbackDone:Promise<void>}};if(doc.startViewTransition&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const result=doc.startViewTransition(async()=>{update();this.cdr.detectChanges();});void result.finished.catch(()=>{});void result.ready.catch(()=>{});void result.updateCallbackDone.catch(()=>{});}else update();}
 openDemo(event?:Event){event?.preventDefault();if(this.demoOpen())return;this.lastFocus=document.activeElement as HTMLElement;this.oldOverflow=document.body.style.overflow;this.projectView.set('demo');this.transition(()=>{this.demoOpen.set(true);document.body.style.overflow='hidden';document.querySelector<HTMLDialogElement>('.project-dialog')?.showModal();});}
 closeDemo(event?:Event){event?.preventDefault();this.transition(()=>document.querySelector<HTMLDialogElement>('.project-dialog')?.close());}
 afterDemoClosed(){this.demoOpen.set(false);document.body.style.overflow=this.oldOverflow;this.showTaskForm.set(false);this.lastFocus?.focus({preventScroll:true});}
 cancelDemo(event:Event){event.preventDefault();this.closeDemo();}
 backdropClick(event:MouseEvent){if(event.target===event.currentTarget)this.closeDemo();}
 addTask(event:Event,title:string,tag:string,due:string){event.preventDefault();const clean=title.trim();if(!clean){this.demoMessage.set('Scrivi un nome per l’attività.');return;}if(this.demoTasks().length>=200){this.demoMessage.set('La demo contiene già 200 attività. Eliminane una prima di aggiungerne altre.');return;}this.demoTasks.update(tasks=>[...tasks,{id:crypto.randomUUID(),title:clean.slice(0,90),tag,state:'Da fare',due}]);this.query.set('');this.stateFilter.set('Tutte');this.showTaskForm.set(false);this.saveDemo();this.demoMessage.set('Attività aggiunta: '+clean);}
 changeTaskState(id:string,state:string){if(!this.states.includes(state as TaskState))return;this.demoTasks.update(tasks=>tasks.map(t=>t.id===id?{...t,state:state as TaskState}:t));this.saveDemo();this.demoMessage.set('Attività spostata in '+state+'.');}
 deleteTask(id:string){this.demoTasks.update(tasks=>tasks.filter(t=>t.id!==id));this.saveDemo();this.demoMessage.set('Attività eliminata.');}
 resetDemo(){this.demoTasks.set(this.sampleTasks());this.query.set('');this.stateFilter.set('Tutte');this.saveDemo();this.demoMessage.set('Bacheca di esempio ripristinata.');}
 startDrag(event:DragEvent,id:string){event.dataTransfer?.setData('text/plain',id);if(event.dataTransfer)event.dataTransfer.effectAllowed='move';}
 allowDrop(event:DragEvent,state:TaskState){event.preventDefault();this.dragOver.set(state);if(event.dataTransfer)event.dataTransfer.dropEffect='move';}
 dropTask(event:DragEvent,state:TaskState){event.preventDefault();const id=event.dataTransfer?.getData('text/plain');if(id&&this.demoTasks().some(t=>t.id===id))this.changeTaskState(id,state);this.dragOver.set('');}
 formatDue(value:string){const [year,month,day]=value.split('-').map(Number);return new Intl.DateTimeFormat(this.language()==='en'?'en-GB':'it-IT').format(new Date(year,month-1,day));}

 scene=signal(0);
 private frame=0;
 private revealObserver?: IntersectionObserver;
 ngAfterViewInit(){
   this.updateLanguageMetadata();
   this.updateScene();
   if(!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window){
     this.revealObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('is-revealed');this.revealObserver?.unobserve(entry.target);}}},{threshold:0.08});
     document.querySelectorAll('.project,.chapter-title,.service-card,.about-columns p,.job,.skill-grid article,.contact').forEach(el=>{el.classList.add('reveal-section');this.revealObserver?.observe(el);});
   }
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

 ngOnDestroy(){if(this.frame)cancelAnimationFrame(this.frame);this.revealObserver?.disconnect();}

 turn=signal(-13); lift=signal(3);
 movePanel(event: PointerEvent){if(event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches || innerWidth < 1000) return; const rect=(event.currentTarget as HTMLElement).getBoundingClientRect(); this.turn.set(-13+((event.clientX-rect.left)/rect.width-.5)*5);this.lift.set(3-((event.clientY-rect.top)/rect.height-.5)*3);}
 resetPanel(){this.turn.set(-13);this.lift.set(3);}
 columns=[
 {name:'Da fare',tasks:[{title:'Definire architettura backend',tag:'Backend',date:'12 apr'},{title:'Implementare autenticazione',tag:'.NET',date:'15 apr'},{title:'UI calendario',tag:'Frontend',date:'18 apr'}]},
 {name:'In corso',tasks:[{title:'Sviluppo dashboard',tag:'Angular',date:'Oggi'},{title:'Integrazione API',tag:'Backend',date:'Domani'},{title:'Design system',tag:'UI',date:'22 apr'}]},
 {name:'Completate',tasks:[{title:'Setup progetto',tag:'Dev',date:'2 apr'},{title:'Modello dati',tag:'SQL',date:'5 apr'},{title:'Wireframe UI',tag:'Design',date:'7 apr'}]}
 ];
 light=signal(false); copied=signal(false); year=new Date().getFullYear();
 featuredIndex=signal(0);
 featuredProject=computed(()=>this.projects[this.featuredIndex()]);
 jumpProject(direction:number){this.selectFeatured(direction);const target=document.getElementById('lavoro-'+this.featuredIndex());if(!target)return;const behavior=matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth';if(getComputedStyle(target).position==='sticky'){const list=target.parentElement!;const preceding=Array.from(list.children).slice(0,this.featuredIndex()).reduce((sum,el)=>sum+(el as HTMLElement).offsetHeight,0);window.scrollTo({top:list.getBoundingClientRect().top+scrollY+preceding-24,behavior});}else target.scrollIntoView({behavior,block:'center'});}
 selectFeatured(direction:number){this.featuredIndex.update(index=>(index+direction+this.projects.length)%this.projects.length);this.resetPanel();}
 openFeatured(event:Event){if(this.featuredProject().demo)this.openDemo(event);}
 projects=PROJECTS;
 services=SERVICES;
 guarantees=GUARANTEES;
 jobs=JOBS;
 skills=SKILLS;
 async copyEmail(){try{await navigator.clipboard.writeText('gioelevalori998@gmail.com');this.copied.set(true);setTimeout(()=>this.copied.set(false),3000);}catch{location.href='mailto:gioelevalori998@gmail.com';}}
}
