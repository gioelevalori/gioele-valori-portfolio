import { Component, inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PROJECTS } from './portfolio-data';
import { ENGLISH } from './translations';
import { ProjectPreviewComponent } from './project-preview.component';
import { ScrollRevealDirective } from './scroll-reveal.directive';
@Component({selector:'app-project-gallery',standalone:true,imports:[RouterLink,ProjectPreviewComponent,ScrollRevealDirective],templateUrl:'./project-gallery.component.html',styleUrl:'./project-gallery.component.css'})
export class ProjectGalleryComponent implements OnInit {
 private document=inject(DOCUMENT);private route=inject(ActivatedRoute);
 readonly language:'it'|'en'=this.route.snapshot.data['language']??'it';readonly projects=PROJECTS;
 t(value:string){return this.language==='en'?(ENGLISH[value]??value):value;}
 path(){return this.language==='en'?'/en/projects/':'/progetti/';}
 alternate(){return this.language==='en'?'/progetti/':'/en/projects/';}
 studyUrl(slug:string){return this.path()+slug+'/';}
 ngOnInit(){const doc=this.document;const origin='https://gioelevalori.dev';const title=this.t('Progetti')+' — Gioele Valori';const description=this.t('Applicazioni e siti web, dall’idea alla realizzazione.');doc.documentElement.lang=this.language;doc.title=title;
 for(const selector of ['meta[name="description"]','meta[property="og:description"]','meta[name="twitter:description"]'])doc.querySelector(selector)?.setAttribute('content',description);
 for(const selector of ['meta[property="og:title"]','meta[name="twitter:title"]'])doc.querySelector(selector)?.setAttribute('content',title);
 doc.querySelector('link[rel="canonical"]')?.setAttribute('href',origin+this.path());doc.querySelector('meta[property="og:url"]')?.setAttribute('content',origin+this.path());doc.querySelector('meta[property="og:type"]')?.setAttribute('content','website');doc.querySelector('meta[property="og:locale"]')?.setAttribute('content',this.language==='en'?'en_GB':'it_IT');
 for(const selector of ['meta[property="og:image"]','meta[name="twitter:image"]'])doc.querySelector(selector)?.setAttribute('content',origin+'/social-card.png');doc.querySelector('meta[property="og:image:width"]')?.setAttribute('content','1200');doc.querySelector('meta[property="og:image:height"]')?.setAttribute('content','630');doc.querySelector('meta[property="og:image:alt"]')?.setAttribute('content',title);
 for(const lang of ['it','en']){let link=doc.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="'+lang+'"]');if(!link){link=doc.createElement('link');link.rel='alternate';link.hreflang=lang;doc.head.appendChild(link);}link.href=origin+(lang==='en'?'/en/projects/':'/progetti/');}
 const structured=doc.querySelector('script[type="application/ld+json"]');if(structured)structured.textContent=JSON.stringify({'@context':'https://schema.org','@type':'ItemList',name:title,url:origin+this.path(),itemListElement:this.projects.map((p,i)=>({'@type':'ListItem',position:i+1,name:p.name,url:origin+(p.demo?'/?demo=spazio':this.studyUrl(p.slug))}))});
 }
}
