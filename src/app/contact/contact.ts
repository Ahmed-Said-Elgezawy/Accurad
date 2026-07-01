import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Sidebar } from '../service/sidebar';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
@Component({
  selector: 'app-contact',
  imports: [CommonModule,FormsModule,TranslocoDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnInit{
  sidebar = inject(Sidebar)
  toggleMenu(){
    this.sidebar.toggleSidebar();
  }

currentLang: string;
languages: string[];

constructor(
  private translocoService: TranslocoService,
  private renderer: Renderer2,
  private router: Router
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
  }
  // ======
isSending = false;
formData = {
  doctorName: '',
  centerName: '',
  mobileNumber: '',
  country: '',
  message: ''
};

submitForm() {

  // منع الضغط أكثر من مرة
  if (this.isSending) {
    return;
  }

  // التحقق من الحقول المطلوبة
  if (
    !this.formData.doctorName.trim() ||
    !this.formData.centerName.trim() ||
    !this.formData.country ||
    !this.formData.mobileNumber.trim() ||
    !this.formData.message.trim()
  ) {
    alert('Please fill in all required fields.');
    return;
  }

  this.isSending = true;

  const templateParams = {

    doctor_name: this.formData.doctorName,

    center_name: this.formData.centerName,

    doctor_phone: this.formData.mobileNumber,

    country: this.formData.country,

    message: this.formData.message

  };

  emailjs.send(
    'service_ijkjdrb',
    'template_e1bf5vx',
    templateParams,
    'SQlYndBiVSMIhAb83'
  )

  .then(() => {

    this.generateConfetti();

    this.showSuccess = true;

    // إعادة تعيين النموذج
    this.formData = {
      doctorName: '',
      centerName: '',
      mobileNumber: '',
      country: '',
      message: ''
    };

  })

  .catch((error) => {

    console.error(error);

    alert('Failed to send.');

  })

  .finally(() => {

    // إعادة تفعيل زر الإرسال سواء نجح أو فشل
    this.isSending = false;

  });

}

get isFormValid(): boolean {
  return !!(
    this.formData.doctorName.trim() &&
    this.formData.centerName.trim() &&
    this.formData.country &&
    this.formData.mobileNumber.trim() &&
    this.formData.message.trim()
  );
}

  // ==== message ===
  showSuccess = false;
 
// 2. مصفوفة الكونفيتي
confettiDots: any[] = [];
 
// 3. دالة توليد الكونفيتي — استدعِها داخل submitForm بعد النجاح
generateConfetti() {
  const colors = ['#1a56db', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  this.confettiDots = Array.from({ length: 20 }, (_, i) => ({
    color:    colors[i % colors.length],
    size:     `${6 + Math.random() * 8}px`,
    left:     `${20 + Math.random() * 60}%`,
    top:      `${10 + Math.random() * 30}%`,
    tx:       `${(Math.random() - 0.5) * 200}px`,
    ty:       `-${80 + Math.random() * 150}px`,
    delay:    `${0.55 + Math.random() * 0.4}s`,
    duration: `${0.8 + Math.random() * 0.5}s`,
  }));
}
}

