import { Routes } from '@angular/router';
import { provideTransloco, provideTranslocoScope } from '@jsverse/transloco';
import { Home } from './home/home';
import { About } from './about/about';
import { Service } from './service/service';
import { Contact } from './contact/contact';
import { Request } from './request/request';
import { PrivacyPolicy } from './privacy-policy/privacy-policy';

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
        providers: [provideTranslocoScope('services')]
    },
    {
        path:'contact',
        component:Contact,
        providers: [provideTranslocoScope('contact')]
    },
    {
        path:'request',
        component:Request,
        providers: [provideTranslocoScope('request')]
    },
    {
        path:'privacy-policy',
        component:PrivacyPolicy,
        providers: [provideTranslocoScope('privacy')]
    },

];
