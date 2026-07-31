import { Routes } from '@angular/router';
import { provideTransloco, provideTranslocoScope } from '@jsverse/transloco';
import { Home } from './home/home';
import { About } from './about/about';
import { Service } from './service/service';
import { Contact } from './contact/contact';
import { Request } from './request/request';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'home',
        pathMatch:'full'
    },

    {
        path:'home',
        component: Home,
        providers: [provideTranslocoScope('home')]
    },
    {
        path:'about',
        component:About,
        // loadComponent: ()=> import("./about/about").then((m)=> m.About),
        providers: [provideTranslocoScope('about')]
    },
    {
        path:'service',
        component:Service,
        // loadComponent: ()=> import("./service/service").then((m)=> m.Service),
        providers: [provideTranslocoScope('services')]
    },
    {
        path:'contact',
        component:Contact,
        // loadComponent: ()=> import("./contact/contact").then((m)=> m.Contact),
        providers: [provideTranslocoScope('contact')]
    },
    {
        path:'request',
        component:Request,
        // loadComponent: ()=> import("./request/request").then((m)=> m.Request),
        providers: [provideTranslocoScope('request')]
    },

];
