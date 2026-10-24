import { Component, Input } from '@angular/core';

@Component({selector:'app-project-preview',standalone:true,template:`
<span class="preview-composition">
  <span class="preview-desktop"><span class="preview-chrome" aria-hidden="true"><i></i><i></i><i></i><span>{{name}}</span></span><picture><source type="image/avif" [srcset]="sources(desktop,'avif',false)" [attr.sizes]="wide?'(min-width:1800px) 1200px, 68vw':'(max-width:900px) 68vw, (min-width:1700px) 850px, 44vw'"><source type="image/webp" [srcset]="sources(desktop,'webp',false)" [attr.sizes]="wide?'(min-width:1800px) 1200px, 68vw':'(max-width:900px) 68vw, (min-width:1700px) 850px, 44vw'"><img [src]="desktop" [srcset]="desktop.replace('.png','@2x.png')+' 2x'" [alt]="name+' — desktop'" width="1440" height="900" [loading]="eager?'eager':'lazy'" decoding="async"></picture></span>
  <span class="preview-mobile"><span class="preview-speaker" aria-hidden="true"></span><picture><source type="image/avif" [srcset]="sources(mobile,'avif',true)" [attr.sizes]="wide?'(min-width:1800px) 280px, 16vw':'(max-width:900px) 16vw, (min-width:1700px) 195px, 10vw'"><source type="image/webp" [srcset]="sources(mobile,'webp',true)" [attr.sizes]="wide?'(min-width:1800px) 280px, 16vw':'(max-width:900px) 16vw, (min-width:1700px) 195px, 10vw'"><img [src]="mobile" [srcset]="mobile.replace('.png','@2x.png')+' 2x'" [alt]="name+' — mobile'" width="390" height="844" [loading]="eager?'eager':'lazy'" decoding="async"></picture></span>
</span>`})
export class ProjectPreviewComponent {
  @Input({required:true}) desktop='';
  @Input({required:true}) mobile='';
  @Input({required:true}) name='';
  @Input() eager=false;
  @Input() wide=false;
  sources(path:string,format:string,mobile:boolean){return (mobile?[195,390,780]:[480,960,1440,2880]).map(width=>path.replace('.png','-'+width+'.'+format)+' '+width+'w').join(',');}
}
