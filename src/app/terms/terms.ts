import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-terms',
  imports: [CommonModule,TranslocoDirective],
  templateUrl: './terms.html',
  styleUrl: './terms.css',
})
export class Terms {
currentLang: string;
languages: string[];

constructor(
  private translocoService: TranslocoService,
  private renderer: Renderer2,
  private router: Router,
  private titleService: Title, private meta: Meta
){

  // قراءة اللغة المحفوظة
  const savedLang = localStorage.getItem('lang');

  this.currentLang = savedLang || this.translocoService.getDefaultLang();

  // تفعيل اللغة
  this.translocoService.setActiveLang(this.currentLang);

  const availableLangs = this.translocoService.getAvailableLangs();

  if(Array.isArray(availableLangs) && typeof availableLangs[0] === 'string'){
    this.languages = availableLangs as string[];
  }else{
    this.languages = (availableLangs as {id:string; label:string}[])
      .map(lang => lang.id)
  }

  // تغيير الاتجاه عند تغيير اللغة
  this.translocoService.langChanges$.subscribe(lang => {
    this.updateDirection(lang);
  });

  // تعيين الاتجاه عند تحميل الصفحة
  this.updateDirection(this.currentLang);
}


updateDirection(lang: string) {

  const rtlLangs = ['ar'];
  const direction = rtlLangs.includes(lang) ? 'rtl' : 'ltr';

  this.renderer.setAttribute(document.documentElement,'dir',direction);

}


changeLang(langCode: string): void {

  this.translocoService.setActiveLang(langCode);
  this.currentLang = langCode;

  // حفظ اللغة
  localStorage.setItem('lang', langCode);
}
// =======
  ngOnInit(): void {
  this.router.events.subscribe((event: any)=>{
    if(event  instanceof NavigationEnd){
      window.scrollTo(0,0)
    }
  })
  this.titleService.setTitle('Terms & Conditions | Accurad Teleradiology Solutions');
this.meta.updateTag({ 
  name: 'description', 
  content: 'Read the Terms & Conditions governing the use of Accurad Teleradiology Solutions\' services, including client rights and obligations, the nature of services provided, and data and medical report handling policies.' 
});
  }

  // ============
  @ViewChildren('tocLink') tocLinks!: QueryList<ElementRef<HTMLAnchorElement>>;
  @ViewChildren('sectionRef') sectionRefs!: QueryList<ElementRef<HTMLElement>>;
 
  private observer?: IntersectionObserver;
 
  ngAfterViewInit(): void {
    // ننتظر جولة الرصد التالية لضمان استقرار القوائم بعد أول Change Detection
    queueMicrotask(() => this.setupScrollSpy());
  }
 
  private setupScrollSpy(): void {
    const linkEls = this.tocLinks.map(ref => ref.nativeElement);
 
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = '#' + entry.target.id;
          const link = linkEls.find(
            (l) => l.getAttribute('href') === id
          );
 
          if (entry.isIntersecting) {
            linkEls.forEach((l) => l.classList.remove('active'));
            link?.classList.add('active');
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );
 
    this.sectionRefs.forEach((ref) => {
      if (ref?.nativeElement) {
        this.observer?.observe(ref.nativeElement);
      }
    });
  }
 
  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
 
  // يمنع Angular Router من اعتراض الرابط، ويقوم بالتمرير يدويًا داخل نفس الصفحة
  scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
 
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
