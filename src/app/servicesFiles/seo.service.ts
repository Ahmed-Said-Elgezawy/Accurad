import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoData {
  title: Record<string, string>;
  description: Record<string, string>;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private currentSeoData: SeoData | null = null;

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private meta: Meta,
    private titleService: Title
  ) {}

  setPageData(data: SeoData): void {
    this.currentSeoData = data;
  }

  updateForLang(lang: string): void {
    this.updateHtmlLang(lang);

    if (!this.currentSeoData) return;

    const title = this.currentSeoData.title[lang] ?? this.currentSeoData.title['en'];
    const description = this.currentSeoData.description[lang] ?? this.currentSeoData.description['en'];

    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
  }

  updateCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = this.doc.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private updateHtmlLang(lang: string): void {
    this.doc.documentElement.lang = lang;
    this.doc.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
}