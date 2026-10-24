import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {PROJECTS} from '../src/portfolio-data.ts';
import {ENGLISH} from '../src/translations.ts';
const studies=JSON.parse(await readFile(new URL('../src/content/project-studies.json',import.meta.url),'utf8'));
const output=new URL('../dist/portfolio/browser/',import.meta.url);
const shell=await readFile(new URL('index.csr.html',output),'utf8');
const homepage=await readFile(new URL('index.html',output),'utf8');
if(!homepage.includes('<app-home'))throw new Error('Missing prerendered homepage');
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const language of ['it','en'])for(const[index,study]of studies.entries()){
 const project=PROJECTS.find(project=>project.slug===study.slug);if(!project)throw new Error('Missing project: '+study.slug);
 const path=(language==='en'?'en/projects/':'progetti/')+study.slug+'/';
 const title=study.name+' — '+(language==='en'?'Case study':'Caso studio')+' | Gioele Valori';
 const description=language==='en'?(ENGLISH[study.problem]??study.problem):study.problem;
 const url='https://gioelevalori.dev/'+path;
 let routeShell;try{routeShell=await readFile(new URL(path+'index.html',output),'utf8');}catch{throw new Error('Missing Angular prerender: '+path);}
 let page=routeShell.replace('<html lang="it">',`<html lang="${language}">`).replace(/<title>.*?<\/title>/,`<title>${escape(title)}</title>`);
 for(const key of ['name="description"','property="og:description"','name="twitter:description"'])page=page.replace(new RegExp(`<meta ${key} content="[^"]*">`),`<meta ${key} content="${escape(description)}">`);
 for(const key of ['property="og:title"','name="twitter:title"'])page=page.replace(new RegExp(`<meta ${key} content="[^"]*">`),`<meta ${key} content="${escape(title)}">`);
 page=page.replace(/<link rel="canonical" href="[^"]*">/,`<link rel="canonical" href="${url}">`).replace(/<meta property="og:url" content="[^"]*">/,`<meta property="og:url" content="${url}">`);
 for(const key of ['property="og:image"','name="twitter:image"'])page=page.replace(new RegExp(`<meta ${key} content="[^"]*">`),`<meta ${key} content="https://gioelevalori.dev/${project.image}">`);
 page=page.replace(/<meta property="og:locale" content="[^"]*">/,`<meta property="og:locale" content="${language==='en'?'en_GB':'it_IT'}">`);
 page=page.replace(/<meta property="og:type" content="[^"]*">/,'<meta property="og:type" content="article">').replace(/<meta property="og:image:width" content="[^"]*">/,'<meta property="og:image:width" content="1440">').replace(/<meta property="og:image:height" content="[^"]*">/,'<meta property="og:image:height" content="900">').replace(/<meta property="og:image:alt" content="[^"]*">/,`<meta property="og:image:alt" content="${escape(study.name)}">`);
 page=page.replace(/<script type="application\/ld\+json">.*?<\/script>/,`<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'CreativeWork',name:study.name,url,description,creator:{'@type':'Person',name:'Gioele Valori',url:'https://gioelevalori.dev/'}})}</script>`);
 page=page.replace('</head>',`<link rel="alternate" hreflang="it" href="https://gioelevalori.dev/progetti/${study.slug}/"><link rel="alternate" hreflang="en" href="https://gioelevalori.dev/en/projects/${study.slug}/"></head>`);
 const folder=new URL(path,output);await mkdir(folder,{recursive:true});await writeFile(new URL('index.html',folder),page);
}
await writeFile(new URL('404.html',output),shell);
console.log('Verified prerendered Angular case studies and created the Pages fallback.');

const urls=['/','/progetti/','/en/projects/',...studies.flatMap(study=>['/progetti/'+study.slug+'/','/en/projects/'+study.slug+'/'])];
await writeFile(new URL('sitemap.xml',output),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(path=>'<url><loc>https://gioelevalori.dev'+path+'</loc></url>').join('')+'</urlset>');

const apiUrl=process.env.SPAZIO_API_URL??'';
if(apiUrl){const url=new URL(apiUrl);if(url.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(url.hostname))throw new Error('SPAZIO_API_URL requires HTTPS');}
await writeFile(new URL('spazio-config.json',output),JSON.stringify({apiUrl}));
