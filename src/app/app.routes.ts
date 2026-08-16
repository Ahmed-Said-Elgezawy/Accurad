import { Routes } from '@angular/router';
import { provideTransloco, provideTranslocoScope } from '@jsverse/transloco';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./home/home').then(m => m.Home),
        providers: [provideTranslocoScope('home')],
        data: {
            seo: {
                title: {
                    en: 'Accurad Teleradiology Solutions | Remote Radiology Interpretation',
                    ar: 'Accurad Teleradiology Solutions | حلول تفسير الأشعة عن بعد'
                },
                description: {
                    en: 'Accurad Teleradiology Solutions delivers accurate, high-quality remote radiology interpretation services around the clock.',
                    ar: 'Accurad Teleradiology Solutions تقدم حلول تفسير الأشعة عن بعد بأعلى معايير الدقة والجودة على مدار الساعة.'
                }
            }
        }
    },
    {
        path: 'about-us',
        loadComponent: () => import('./about/about').then(m => m.About),
        providers: [provideTranslocoScope('about')],
        data: {
            seo: {
                title: {
                    en: 'About Us | Accurad Teleradiology Solutions',
                    ar: 'من نحن | Accurad Teleradiology Solutions'
                },
                description: {
                    en: 'Learn about Accurad Teleradiology Solutions, a leading provider of remote radiology interpretation services.',
                    ar: 'تعرف على Accurad Teleradiology Solutions، الشركة الرائدة في تقديم خدمات تفسير الأشعة عن بعد.'
                }
            }
        }
    },
    {
        path: 'services',
        loadComponent: () => import('./service/service').then(m => m.Service),
        providers: [provideTranslocoScope('services')],
        data: {
            seo: {
                title: {
                    en: 'Services | Accurad Teleradiology Solutions',
                    ar: 'خدماتنا | Accurad Teleradiology Solutions'
                },
                description: {
                    en: 'Explore Accurad Teleradiology Solutions\' comprehensive remote radiology services including CT, MRI, and X-ray interpretation.',
                    ar: 'اكتشف خدمات Accurad Teleradiology Solutions المتكاملة في تفسير الأشعة عن بعد شاملة الأشعة المقطعية والرنين المغناطيسي.'
                }
            }
        }
    },
    {
        path: 'contact-us',
        loadComponent: () => import('./contact/contact').then(m => m.Contact),
        providers: [provideTranslocoScope('contact')],
        data: {
            seo: {
                title: {
                    en: 'Contact Us | Accurad Teleradiology Solutions',
                    ar: 'اتصل بنا | Accurad Teleradiology Solutions'
                },
                description: {
                    en: 'Get in touch with Accurad Teleradiology Solutions to learn more about our remote radiology services.',
                    ar: 'تواصل مع فريق Accurad Teleradiology Solutions لمعرفة المزيد عن خدماتنا.'
                }
            }
        }
    },
    {
        path: 'request-a-consultation',
        loadComponent: () => import('./request/request').then(m => m.Request),
        providers: [provideTranslocoScope('request')],
        data: {
            seo: {
                title: {
                    en: 'Request a Consultation | Accurad Teleradiology Solutions',
                    ar: 'طلب استشارة | Accurad Teleradiology Solutions'
                },
                description: {
                    en: 'Request a specialized consultation from Accurad Teleradiology Solutions for accurate radiology report interpretation.',
                    ar: 'اطلب استشارة متخصصة من فريق Accurad Teleradiology Solutions لتفسير دقيق وسريع لتقارير الأشعة.'
                }
            }
        }
    },
    {
        path: 'privacy-policy',
        loadComponent: () => import('./privacy-policy/privacy-policy').then(m => m.PrivacyPolicy),
        providers: [provideTranslocoScope('privacy')],
        data: {
            seo: {
                title: {
                    en: 'Privacy Policy | Accurad Teleradiology Solutions',
                    ar: 'سياسة الخصوصية | Accurad Teleradiology Solutions'
                },
                description: {
                    en: 'Read the Privacy Policy of Accurad Teleradiology Solutions to understand how we protect your data.',
                    ar: 'اطلع على سياسة الخصوصية الخاصة بـ Accurad Teleradiology Solutions وكيفية حمايتنا لبياناتك.'
                }
            }
        }
    },
    {
        path: 'terms-conditions',
        loadComponent: () => import('./terms/terms').then(m => m.Terms),
        providers: [provideTranslocoScope('terms')],
        data: {
            seo: {
                title: {
                    en: 'Terms & Conditions | Accurad Teleradiology Solutions',
                    ar: 'الشروط والأحكام | Accurad Teleradiology Solutions'
                },
                description: {
                    en: 'Read the Terms & Conditions governing the use of Accurad Teleradiology Solutions\' services.',
                    ar: 'اطلع على الشروط والأحكام الخاصة باستخدام خدمات Accurad Teleradiology Solutions.'
                }
            }
        }
    },
];