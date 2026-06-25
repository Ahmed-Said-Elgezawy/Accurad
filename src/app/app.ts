import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Sidebar } from './service/sidebar';
import { CommonModule } from '@angular/common';
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

    isActive = false;
    removeActive = true

 
  ngOnInit(){
    this.sidebar.sidebar$.subscribe(value => {
      this.isActive = value;
      this.removeActive = false
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
             
            //  constructor(private translocoService:TranslocoService,private sidebar: Sidebar){
            //   this.currentLang = this.translocoService.getDefaultLang();
          
            //   const availableLangs = this.translocoService.getAvailableLangs();
            //   if(Array.isArray(availableLangs) && typeof availableLangs[0] === 'string'){
            //     this.languages = availableLangs as string[];
            //   }else{
            //     this.languages = (availableLangs as {id:string; label:string}[]).map(lang => lang.id)
            //   }
            //  }
          
        
        //     changeLang(langCode: string): void {
        //     this.translocoService.setActiveLang(langCode);
        //     this.currentLang = langCode;
        // }

constructor(
  private translocoService: TranslocoService,
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
