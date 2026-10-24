import { provideClientHydration } from '@angular/platform-browser';
import { Component, inject } from '@angular/core';
import { RouterOutlet, provideRouter, withInMemoryScrolling, Router, Routes, withViewTransitions } from '@angular/router';
import { App } from './app.component';
import { CaseStudyComponent } from './case-study.component';
import { ProjectGalleryComponent } from './project-gallery.component';
import STUDIES from './content/project-studies.json';

@Component({selector:'app-root',standalone:true,imports:[RouterOutlet],template:'<router-outlet />'})
export class PortfolioShell {}
const projectExists=(route:import('@angular/router').ActivatedRouteSnapshot)=>STUDIES.some(s=>s.slug===route.paramMap.get('slug'))||inject(Router).parseUrl('/');
export const routes:Routes=[
 {path:'',component:App,pathMatch:'full'},
 {path:'progetti',component:ProjectGalleryComponent,data:{language:'it'}},
 {path:'en/projects',component:ProjectGalleryComponent,data:{language:'en'}},
 {path:'progetti/:slug',component:CaseStudyComponent,data:{language:'it'},canActivate:[projectExists]},
 {path:'en/projects/:slug',component:CaseStudyComponent,data:{language:'en'},canActivate:[projectExists]},
 {path:'**',redirectTo:''}
];
export const appConfig={providers:[provideClientHydration(),provideRouter(routes,withInMemoryScrolling({anchorScrolling:'enabled',scrollPositionRestoration:'enabled'}),withViewTransitions({skipInitialTransition:true,onViewTransitionCreated:({transition,from,to})=>{
 let previous=from;let next=to;while(previous.firstChild)previous=previous.firstChild;while(next.firstChild)next=next.firstChild;
 if(matchMedia('(prefers-reduced-motion: reduce)').matches||(previous.routeConfig===next.routeConfig&&JSON.stringify(previous.params)===JSON.stringify(next.params)))transition.skipTransition();
 void transition.ready.catch(()=>{});void transition.finished.catch(()=>{});void transition.updateCallbackDone.catch(()=>{});
}}))]};
