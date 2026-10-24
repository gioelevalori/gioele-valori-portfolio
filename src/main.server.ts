import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes, RenderMode, PrerenderFallback } from '@angular/ssr';
import { PortfolioShell, appConfig } from './app.config';
import STUDIES from './content/project-studies.json';
const serverConfig={providers:[provideServerRendering(withRoutes([
 {path:'',renderMode:RenderMode.Prerender},
 {path:'progetti',renderMode:RenderMode.Prerender},
 {path:'en/projects',renderMode:RenderMode.Prerender},
 {path:'progetti/:slug',renderMode:RenderMode.Prerender,fallback:PrerenderFallback.Client,getPrerenderParams:async()=>STUDIES.map(s=>({slug:s.slug}))},
 {path:'en/projects/:slug',renderMode:RenderMode.Prerender,fallback:PrerenderFallback.Client,getPrerenderParams:async()=>STUDIES.map(s=>({slug:s.slug}))},
 {path:'**',renderMode:RenderMode.Client}
]))]};
export default (context:BootstrapContext)=>bootstrapApplication(PortfolioShell,mergeApplicationConfig(appConfig,serverConfig),context);
