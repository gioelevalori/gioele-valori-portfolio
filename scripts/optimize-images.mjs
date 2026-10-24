import sharp from 'sharp';
import {readFile,writeFile} from 'node:fs/promises';
const report=[];
for(const slug of ['cookiemakers','cali-al-sole']){
 for(const mobile of [false,true]){
  const stem=slug+(mobile?'-mobile':'');const input='public/projects/'+stem+'@2x.png';
  for(const width of (mobile?[195,390,780]:[480,960,1440,2880]))for(const format of ['avif','webp']){
   const target=`public/projects/${stem}-${width}.${format}`;
   const pipeline=sharp(input).resize({width,withoutEnlargement:true});
   if(format==='avif')await pipeline.avif({quality:72,effort:6,chromaSubsampling:'4:4:4'}).toFile(target);
   else await pipeline.webp({quality:92,effort:6,smartSubsample:true}).toFile(target);
   const bytes=(await readFile(target)).length;report.push({target,width,bytes});
  }
 }
}
await writeFile('public/projects/optimized-images.json',JSON.stringify({source:'Existing original PNG screen captures; source provenance in matching .png.json files.',avifQuality:72,webpQuality:92,files:report},null,2));
console.log(JSON.stringify(report));
