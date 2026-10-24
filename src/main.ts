import { bootstrapApplication } from '@angular/platform-browser';
import { Component, inject } from '@angular/core';
import { RouterOutlet, provideRouter, withInMemoryScrolling, Router, Routes } from '@angular/router';
import { App } from './app.component';
import { CaseStudyComponent } from './case-study.component';
import STUDIES from './content/project-studies.json';

@Component({selector:'app-root',standalone:true,imports:[RouterOutlet],template:'<router-outlet />'})
class PortfolioShell {}
const projectExists=(route:import('@angular/router').ActivatedRouteSnapshot)=>STUDIES.some(s=>s.slug===route.paramMap.get('slug'))||inject(Router).parseUrl('/');
const routes:Routes=[
 {path:'',component:App,pathMatch:'full'},
 {path:'progetti/:slug',component:CaseStudyComponent,data:{language:'it'},canActivate:[projectExists]},
 {path:'en/projects/:slug',component:CaseStudyComponent,data:{language:'en'},canActivate:[projectExists]},
 {path:'**',redirectTo:''}
];
bootstrapApplication(PortfolioShell,{providers:[provideRouter(routes,withInMemoryScrolling({anchorScrolling:'enabled',scrollPositionRestoration:'enabled'}))]}).catch(console.error);
