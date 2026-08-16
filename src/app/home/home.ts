import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import Swiper from 'swiper';
import { Keyboard, Mousewheel, Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Subscription } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TranslocoDirective],
  templateUrl: './home.html',
  styleUrl:  './home.css',
})
export class Home implements OnInit, AfterViewInit, OnDestroy {

  // ── Language ─────────────────────────────────────────────────────────────
  currentLang: string;
  languages:   string[];

  private langSub!: Subscription;

  // ── Swiper ───────────────────────────────────────────────────────────────
  private mainSwiper!: Swiper;

  // timer used to restart autoplay after manual navigation
  private resumeTimer: ReturnType<typeof setTimeout> | null = null;

  // ── Constructor ──────────────────────────────────────────────────────────
  constructor(
    private translocoService: TranslocoService,
    private renderer:Renderer2,
    private router: Router,
    private titleService: Title, private meta: Meta
  ) {
    // read saved language
    const savedLang    = localStorage.getItem('lang');
    this.currentLang   = savedLang || this.translocoService.getDefaultLang();

    // ← طبّق الاتجاه فوراً قبل أي شيء آخر
    this.updateDirection(this.currentLang);

    this.translocoService.setActiveLang(this.currentLang);

    // build languages list
    const available = this.translocoService.getAvailableLangs();
    this.languages  = Array.isArray(available) && typeof available[0] === 'string'
      ? (available as string[])
      : (available as { id: string; label: string }[]).map(l => l.id);

    // react to language changes
    this.langSub = this.translocoService.langChanges$.subscribe(lang => {
      this.updateDirection(lang);
      // نفس منطق الانتظار: نضمن وصول بيانات اللغة الجديدة قبل إعادة البناء
      this.translocoService.load(lang).subscribe(() => {
        setTimeout(() => this.initSwiper(), 0);
      });
    });
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────
  ngOnInit(): void {
this.router.events.subscribe((event: any)=>{
    if(event  instanceof NavigationEnd){
      window.scrollTo(0,0)
    }
  })
this.titleService.setTitle('Accurad Teleradiology Solutions | Remote Radiology Interpretation');
this.meta.updateTag({ 
  name: 'description', 
  content: 'Accurad Teleradiology Solutions delivers accurate, high-quality remote radiology interpretation services, powered by expert radiologists, providing fast and reliable reports around the clock for hospitals and medical centers.' 
});
  }

  ngAfterViewInit(): void {
    this.translocoService.load(this.currentLang).subscribe(() => {
      setTimeout(() => this.initSwiper(), 1000);
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    this.clearResumeTimer();
    this.mainSwiper?.destroy(true, true);
  }

  // ── Direction ─────────────────────────────────────────────────────────────
  updateDirection(lang: string): void {
    const dir = ['ar'].includes(lang) ? 'rtl' : 'ltr';
    this.renderer.setAttribute(document.documentElement, 'dir', dir);
  }

  // ── Language change ───────────────────────────────────────────────────────
  changeLang(langCode: string): void {
    this.translocoService.setActiveLang(langCode);
    this.currentLang = langCode;
    localStorage.setItem('lang', langCode);
  }

  // ── Swiper ────────────────────────────────────────────────────────────────
  initSwiper(): void {
    // destroy previous instance if exists
    if (this.mainSwiper) {
      this.mainSwiper.destroy(true, true);
    }

    const swiperContainer = document.querySelector('.mainSwiper') as HTMLElement | null;
    if (!swiperContainer) return;

    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';

    // نفرض dir على عنصر الـ swiper نفسه بشكل متزامن، مباشرةً قبل
    // إنشاء Swiper، لأن Swiper يقرأ هذه الخاصية من الـ DOM لحظة
    // التهيئة (this.el.dir) وليس من الـ config. هذا يزيل أي اعتماد
    // على توقيت Angular's change detection لتطبيق [dir] binding.
    swiperContainer.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

    // نمرر العنصر نفسه (وليس السلاكتور النصي) حتى نضمن أن Swiper
    // يقرأ بالضبط نفس العنصر الذي عدّلنا عليه الـ dir للتو.
    this.mainSwiper = new Swiper(swiperContainer, {
      modules: [Navigation, Pagination, Keyboard, Mousewheel, Autoplay],


      // ── Autoplay: starts automatically ──
      autoplay: {
        delay:                4000,
        disableOnInteraction: false,   // keeps autoplay alive after interaction
        pauseOnMouseEnter:    true,
        waitForTransition:    true,
      },

      slidesPerView:  1,
      spaceBetween:   24,
      loop:           true,           // loop so autoplay never stops at the end
      grabCursor:     true,
      speed:          800,

      observer:        true,
      observeParents:  true,
      resizeObserver:  true,

      navigation: {
        nextEl: '.swiper-next',
        prevEl: '.swiper-prev',
      },

      breakpoints: {
        640:  { slidesPerView: 1, spaceBetween: 10 },
        768:  { slidesPerView: 2, spaceBetween: 23 },
        1000: { slidesPerView: 2, spaceBetween: 23 },
      },
    });

    // ── Stop autoplay on manual navigation, resume after 3 s ──
    this.mainSwiper.on('navigationNext', () => this.onManualNav());
    this.mainSwiper.on('navigationPrev', () => this.onManualNav());
  }

  /**
   * Called whenever the user clicks Next or Prev.
   * Stops autoplay immediately and schedules a restart after 3 s.
   */
  private onManualNav(): void {
    if (!this.mainSwiper) return;

    // stop autoplay
    this.mainSwiper.autoplay.stop();

    // cancel any previously scheduled resume
    this.clearResumeTimer();

    // restart autoplay after 3 seconds
    this.resumeTimer = setTimeout(() => {
      if (this.mainSwiper && !this.mainSwiper.destroyed) {
        this.mainSwiper.autoplay.start();
      }
    }, 3000);
  } 

  private clearResumeTimer(): void {
    if (this.resumeTimer !== null) {
      clearTimeout(this.resumeTimer);
      this.resumeTimer = null;
    }
  }
}

