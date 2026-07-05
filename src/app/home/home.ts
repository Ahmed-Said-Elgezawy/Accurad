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
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // ★ الإصلاح الجوهري ★
    // *transloco directive لا يرسم محتوى الـ swiper في الـ DOM إلا بعد
    // وصول بيانات الترجمة الفعلية. عند إعادة تحميل الصفحة (cold load)
    // هذا التحميل يمر عبر HTTP ويأخذ وقتاً حقيقياً، لذلك عنصر .mainSwiper
    // غير موجود أصلاً في الـ DOM لحظة تنفيذ ngAfterViewInit، فتفشل تهيئة
    // Swiper بصمت. عند تغيير اللغة يدوياً لاحقاً تكون البيانات محمّلة
    // بالفعل من المرة الأولى، لذلك يبدو أن "اختيار اللغة" هو ما يُصلح
    // الأمر، بينما الحقيقة أنها أول مرة يجد فيها initSwiper() الـ DOM
    // الحقيقي جاهزاً. الحل: ننتظر تحميل الترجمة الفعلي قبل لمس Swiper.
    this.translocoService.load(this.currentLang).subscribe(() => {
      // tick إضافي يضمن أن Angular أنهى فعلياً رسم الـ DOM بعد وصول البيانات
      setTimeout(() => this.initSwiper(), 0);
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