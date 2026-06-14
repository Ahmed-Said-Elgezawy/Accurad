import { Routes } from '@angular/router';
import { provideTransloco, provideTranslocoScope } from '@jsverse/transloco';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'contact',
        pathMatch:'full'
    },

    {
        path:'contact',
        loadComponent: ()=> import("./contact/contact").then((m)=> m.Contact),
        providers: [provideTranslocoScope('contact')]
    },

];
