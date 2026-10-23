import { Component, Input } from '@angular/core';

@Component({selector:'app-project-preview',standalone:true,template:`
<span class="preview-composition">
  <span class="preview-desktop"><span class="preview-chrome" aria-hidden="true"><i></i><i></i><i></i><span>{{name}}</span></span><img [src]="desktop" [srcset]="desktop.replace('.png','@2x.png')+' 2x'" [alt]="name+' — desktop'" width="1440" height="900" loading="lazy"></span>
  <span class="preview-mobile"><span class="preview-speaker" aria-hidden="true"></span><img [src]="mobile" [srcset]="mobile.replace('.png','@2x.png')+' 2x'" [alt]="name+' — mobile'" width="390" height="844" loading="lazy"></span>
</span>`})
export class ProjectPreviewComponent {
  @Input({required:true}) desktop='';
  @Input({required:true}) mobile='';
  @Input({required:true}) name='';
}
