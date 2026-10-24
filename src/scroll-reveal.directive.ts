import { AfterViewInit, Directive, ElementRef, OnDestroy, inject } from '@angular/core';

/** Native scroll timelines drive text motion; one-shot WAAPI is the browser fallback. */
@Directive({selector:'[scrollReveal]',standalone:true,host:{class:'motion-text'}})
export class ScrollRevealDirective implements AfterViewInit, OnDestroy {
 private element=inject(ElementRef<HTMLElement>).nativeElement;
 private media=matchMedia('(prefers-reduced-motion: reduce)');
 private observer?:IntersectionObserver;
 private animation?:Animation;
 private onPreferenceChange=()=>{if(this.media.matches){this.animation?.cancel();this.observer?.disconnect();}else this.observeFallback();};
 ngAfterViewInit(){this.media.addEventListener('change',this.onPreferenceChange);this.observeFallback();}
 private observeFallback(){
  if(this.media.matches||CSS.supports('animation-timeline: view()')||!('IntersectionObserver' in window))return;
  this.observer?.disconnect();
  this.observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){
   this.observer?.disconnect();
   this.animation=this.element.animate([{opacity:.8,transform:'translate3d(0,12px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:1300,easing:'cubic-bezier(.22,.61,.36,1)',fill:'none'});
  }},{threshold:0,rootMargin:'0px 0px -24px 0px'});
  this.observer.observe(this.element);
 }
 ngOnDestroy(){this.observer?.disconnect();this.animation?.cancel();this.media.removeEventListener('change',this.onPreferenceChange);}
}
