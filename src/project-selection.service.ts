import { Injectable, signal } from '@angular/core';

@Injectable({providedIn:'root'})
export class ProjectSelectionService { readonly index=signal(0); }
