import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const cli=fileURLToPath(new URL('../node_modules/@angular/cli/bin/ng.js',import.meta.url));
const result=spawnSync(process.execPath,[cli,'build',...process.argv.slice(2)],{stdio:'inherit'});
if(result.status!==0)process.exit(result.status??1);
await import('./build-route-shells.mjs');
