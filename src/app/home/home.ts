import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import Swiper from 'swiper';
import { Keyboard, Mousewheel, Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Subscription } from 'rxjs';

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
    private renderer:         Renderer2,
  ) {
    // read saved language
    const savedLang    = localStorage.getItem('lang');
    this.currentLang   = savedLang || this.translocoService.getDefaultLang();

    this.translocoService.setActiveLang(this.currentLang);

    // build languages list
    const available = this.translocoService.getAvailableLangs();
    this.languages  = Array.isArray(available) && typeof available[0] === 'string'
      ? (available as string[])
      : (available as { id: string; label: string }[]).map(l => l.id);

    // set direction on load
    this.updateDirection(this.currentLang);

    // react to language changes
    this.langSub = this.translocoService.langChanges$.subscribe(lang => {
      this.updateDirection(lang);
      // rebuild swiper so RTL/LTR re-initialises correctly
      setTimeout(() => this.initSwiper(), 0);
    });
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initSwiper();
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

    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';

    this.mainSwiper = new Swiper('.mainSwiper', {
      modules: [Navigation, Pagination, Keyboard, Mousewheel, Autoplay],


      // ── Autoplay: starts automatically ──
      autoplay: {
        delay:                3000,
        disableOnInteraction: false,   // keeps autoplay alive after interaction
        pauseOnMouseEnter:    true,
        waitForTransition:    true,
      },

      slidesPerView:  1,
      spaceBetween:   24,
      loop:           true,           // loop so autoplay never stops at the end
      grabCursor:     true,
      speed:          600,

      observer:        true,
      observeParents:  true,
      resizeObserver:  true, 

      navigation: {
        nextEl: '.swiper-next',
        prevEl: '.swiper-prev',
      },

      breakpoints: {
        640:  { slidesPerView: 1, spaceBetween: 10 },
        768:  { slidesPerView: 2, spaceBetween: 15 },
        1000: { slidesPerView: 3, spaceBetween: 20 },
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