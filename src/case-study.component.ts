import { ProjectSelectionService } from './project-selection.service';
import { ScrollRevealDirective } from './scroll-reveal.directive';
import { Component, OnInit, OnDestroy, AfterViewInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProjectPreviewComponent } from './project-preview.component';
import { PROJECTS } from './portfolio-data';
import { ENGLISH } from './translations';
import STUDIES from './content/project-studies.json';

@Component({selector:'app-case-study',standalone:true,imports:[RouterLink,ProjectPreviewComponent,ScrollRevealDirective],templateUrl:'./case-study.component.html',styleUrl:'./case-study.component.css'})
export class CaseStudyComponent implements OnInit, OnDestroy, AfterViewInit {
 private route=inject(ActivatedRoute);
 private selection=inject(ProjectSelectionService);
 private subscription?:Subscription;
 index=signal(0);
 language:'it'|'en'=this.route.snapshot.data['language']??'it';
 study=computed(()=>STUDIES[this.index()]);
 project=computed(()=>PROJECTS.find(project=>project.slug===this.study().slug)??PROJECTS[0]);
 t(value:string){return this.language==='en'?(ENGLISH[value]??value):value;}
 alternateUrl(){return (this.language==='en'?'/progetti/':'/en/projects/')+this.study().slug+'/';}
 ngOnInit(){this.subscription=this.route.paramMap.subscribe(params=>{const index=STUDIES.findIndex(s=>s.slug===params.get('slug'));if(index<0)return;this.index.set(index);this.selection.index.set(PROJECTS.findIndex(project=>project.slug===this.study().slug));try{localStorage.setItem('gv-portfolio-language',this.language);}catch{}this.updateMetadata();});}
 ngAfterViewInit(){document.getElementById('case-page-title')?.focus({preventScroll:true});}
 private updateMetadata(){
  const origin='https://gioelevalori.dev';const url=origin+(this.language==='en'?'/en/projects/':'/progetti/')+this.study().slug+'/';
  const title=this.study().name+' — '+(this.language==='en'?'Case study':'Caso studio')+' | Gioele Valori';
  document.documentElement.lang=this.language;document.title=title;
  for(const selector of ['meta[name="description"]','meta[property="og:description"]','meta[name="twitter:description"]'])document.querySelector(selector)?.setAttribute('content',this.t(this.study().problem));
  for(const selector of ['meta[property="og:title"]','meta[name="twitter:title"]'])document.querySelector(selector)?.setAttribute('content',title);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href',url);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content',url);
  document.querySelector('meta[property="og:locale"]')?.setAttribute('content',this.language==='en'?'en_GB':'it_IT');
  for(const selector of ['meta[property="og:image"]','meta[name="twitter:image"]'])document.querySelector(selector)?.setAttribute('content',origin+'/'+this.project().image);
  document.querySelector('meta[property="og:type"]')?.setAttribute('content','article');
  document.querySelector('meta[property="og:image:width"]')?.setAttribute('content','1440');document.querySelector('meta[property="og:image:height"]')?.setAttribute('content','900');
  document.querySelector('meta[property="og:image:alt"]')?.setAttribute('content',this.study().name);
  const structured=document.querySelector('script[type="application/ld+json"]');if(structured)structured.textContent=JSON.stringify({'@context':'https://schema.org','@type':'CreativeWork',name:this.study().name,url,description:this.t(this.study().problem),creator:{'@type':'Person',name:'Gioele Valori',url:origin}});
  for(const lang of ['it','en']){let link=document.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="'+lang+'"]');if(!link){link=document.createElement('link');link.rel='alternate';link.hreflang=lang;document.head.appendChild(link);}link.href=origin+(lang==='en'?'/en/projects/':'/progetti/')+this.study().slug+'/';}
 }
 ngOnDestroy(){this.subscription?.unsubscribe();}
}
