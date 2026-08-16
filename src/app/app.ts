import { Component, DestroyRef, HostListener, inject } from '@angular/core';
import { RouterLink, RouterOutlet , NavigationEnd, ActivatedRoute } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Router, } from '@angular/router';
import { Sidebar } from './service/sidebar';
import { CommonModule } from '@angular/common';
import { filter, map, mergeMap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SeoService } from './servicesFiles/seo.service';

const SITE_URL = 'https://www.accuradteleradiology.com';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLink,CommonModule,TranslocoDirective,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  toggleMenu(){
    this.sidebar.toggleSidebar();
  }
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private translocoService = inject(TranslocoService);
  private seoService = inject(SeoService);
  private destroyRef = inject(DestroyRef);
  isActive = false;
  removeActive = true

  ngOnInit(){
    this.sidebar.sidebar$.subscribe(value => {
      this.isActive = value;
      this.removeActive = false
    });
    // =========
    // كل مرة الراوت يتغير: حدث الـ SEO data + الـ canonical URL
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((event) => {
      const navEvent = event as NavigationEnd;

      // تحديث الـ canonical URL حسب الرابط الحالي
      const cleanUrl = navEvent.urlAfterRedirects.split('?')[0]; // يشيل أي query params
      this.seoService.updateCanonicalUrl(`${SITE_URL}${cleanUrl}`);

      // هات بيانات الـ SEO الخاصة بالراوت الحالي
      let route = this.activatedRoute;
      while (route.firstChild) {
        route = route.firstChild;
      }

      route.data.subscribe((data) => {
        if (data['seo']) {
          this.seoService.setPageData(data['seo']);
          this.seoService.updateForLang(this.translocoService.getActiveLang());
        }
      });
    });

    // كل مرة اللغة تتغير: حدث الـ meta tags لنفس الصفحة الحالية
    this.translocoService.langChanges$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((lang) => {
      this.seoService.updateForLang(lang);
    });
  }

    closeMenu(){
      setTimeout(()=>{
        this.sidebar.closeSidebar();
      },700)
      this.removeActive = true
  }
    closeMenul(){
      this.sidebar.closeSidebar();
    }
    // =========
    currentLang:string;
    languages:string[];
constructor(
  private sidebar: Sidebar
) {

  const savedLang = localStorage.getItem('lang');

  this.currentLang =
    savedLang || this.translocoService.getDefaultLang();

  this.translocoService.setActiveLang(this.currentLang);

  const availableLangs = this.translocoService.getAvailableLangs();

  if (
    Array.isArray(availableLangs) &&
    typeof availableLangs[0] === 'string'
  ) {

    this.languages = availableLangs as string[];

  } else {

    this.languages =
      (availableLangs as { id: string; label: string }[])
      .map(lang => lang.id);
  }
}

  changeLang(langCode: string): void {

  this.translocoService.setActiveLang(langCode);

  this.currentLang = langCode;

  localStorage.setItem('lang', langCode);
}

// === scroll-up ===
  scrollPercent = 0;
  isSticky = false;
  lastScrollY = 0;
  hideHeader = true;
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    const totalScrollable = scrollHeight - clientHeight;

    this.scrollPercent = (scrollTop / totalScrollable) * 100;
  // ==sticky==
    this.isSticky = window.scrollY > 200;
  // ==fixed==
    const currentScrollY = window.scrollY;

    if (currentScrollY > this.lastScrollY) {
      // Scroll Down 👇
      this.hideHeader = false;
      // this.IsOpened = false
    } else {
      // Scroll Up 👆
      this.hideHeader = true;
      
    }
    this.lastScrollY = currentScrollY;
  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
