import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import Swiper from 'swiper';
import { Keyboard } from 'swiper/modules';
import { Navigation } from 'swiper/modules';
import { Pagination } from 'swiper/modules';
import { Mousewheel } from 'swiper/modules';
import { EffectCoverflow } from 'swiper/modules';
Swiper.use([Navigation, Pagination, EffectCoverflow, Keyboard, Mousewheel]);
@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit ,AfterViewInit,OnDestroy{

currentLang: string;
languages: string[];


constructor(
  private translocoService: TranslocoService,
  private renderer: Renderer2
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
  ngOnInit(): void {
    this.swiper()
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
swiper(){
         this.mainSwiper = new Swiper(".mainSwiper", {
          spaceBetween:24,
          loop:true,
          grabCursor:true,
          navigation: {
          nextEl: ".swiper1-next",
          prevEl: ".swiper1-prev",
          },
          breakpoints: {
              640: {
              slidesPerView: 1,
              spaceBetween: 10,
              },
              768: {
              slidesPerView: 2,
              spaceBetween: 15,
              },
              1000: {
              slidesPerView: 3,
              spaceBetween: 20,
              },
          },
      });

    //   this.mainSwiper = new Swiper(".mainSwiper", {
    //   effect: "coverflow",
    //   grabCursor: true,
    //   centeredSlides: true,
    //   slidesPerView: 'auto',
    //   coverflowEffect: {
    //     rotate: 0,
    //     stretch: 0,
    //     depth: 100,
    //     modifier: 3,
    //     slideShadows: true
    //   },
    //   keyboard: {
    //     enabled: true
    //   },
    //   mousewheel: {
    //   releaseOnEdges: true, 
    //   sensitivity: 1, 
    //   },
    //   loop: true,
    //   pagination: {
    //     el: ".swiper-pagination",
    //     clickable: true
    //   },
    //   breakpoints: {
    //     640: {
    //       slidesPerView: 2
    //     },
    //     768: {
    //       slidesPerView: 1
    //     },
    //     1024: {
    //       slidesPerView: 2
    //     },
    //     1560: {
    //       slidesPerView: 3
    //     }
    //   }
    // });
    }

// === autoSlide ===
mainSwiper!: Swiper;

private autoSlideInterval: any;
private restartTimeout: any;

ngAfterViewInit() {
  this.startAutoSlide();
}

ngOnDestroy() {
  clearInterval(this.autoSlideInterval);
  clearTimeout(this.restartTimeout);
}

startAutoSlide() {
  this.stopAutoSlide();

  this.autoSlideInterval = setInterval(() => {
    this.slidePrev();
  }, 3000);
}

stopAutoSlide() {
  if (this.autoSlideInterval) {
    clearInterval(this.autoSlideInterval);
  }
}

pauseAndRestartAutoSlide() {
  this.stopAutoSlide();

  clearTimeout(this.restartTimeout);

  this.restartTimeout = setTimeout(() => {
    this.startAutoSlide();
  }, 6000);
}

slideNext() {
  this.mainSwiper?.slideNext();
  this.pauseAndRestartAutoSlide();
}

slidePrev() {
  this.mainSwiper?.slidePrev();
  this.pauseAndRestartAutoSlide();
}

}
