import { Routes } from '@angular/router';
import { provideTransloco, provideTranslocoScope } from '@jsverse/transloco';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'contact',
        pathMatch:'full'
    },

    {
        path:'about',
        loadComponent: ()=> import("./about/about").then((m)=> m.About),
        providers: [provideTranslocoScope('about')]
    },
    {
        path:'service',
        loadComponent: ()=> import("./service/service").then((m)=> m.Service),
        providers: [provideTranslocoScope('services')]
    },
    {
        path:'contact',
        loadComponent: ()=> import("./contact/contact").then((m)=> m.Contact),
        providers: [provideTranslocoScope('contact')]
    },
    {
        path:'request',
        loadComponent: ()=> import("./request/request").then((m)=> m.Request),
        // providers: [provideTranslocoScope('contact')]
    },

];
