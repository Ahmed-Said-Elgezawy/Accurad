import { Component, Renderer2 } from '@angular/core';
import emailjs from '@emailjs/browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';
@Component({
  selector: 'app-request',
  imports: [FormsModule,CommonModule],
  templateUrl: './request.html',
  styleUrl: './request.css',
})
export class Request {

  steps = [
  { title: 'Basic Information', desc: 'Tell us about you and your center' },
  { title: 'Facility Type',     desc: 'Select your facility category' },
  { title: 'Imaging Volume',    desc: 'Tell us about your imaging volume' },
  { title: 'Modalities',        desc: 'Choose the modalities you work with' },
  { title: 'Coverage',          desc: 'Select your coverage requirements' },
];

  currentStep = 1;

formData = {
  doctorName: '',
  centerName: '',
  country: '',
  facilityType: '',
  imagingVolume: '',
  modalities: [] as string[],
  coverage: ''
};

  nextStep() {

    if (this.isStepValid()) {
      this.currentStep++;
    }

  }

  previousStep() {

    if (this.currentStep > 1) {
      this.currentStep--;
    }

  }

onModalityChange(event: any, modality: string) {

  if (event.target.checked) {

    this.formData.modalities.push(modality);

  } else {

    this.formData.modalities =
      this.formData.modalities.filter(
        (item: string) => item !== modality
      );

  }

}

  isStepValid(): boolean {

    switch (this.currentStep) {

      case 1:
        return !!(
          this.formData.doctorName &&
          this.formData.centerName &&
          this.formData.country
        );

      case 2:
        return !!this.formData.facilityType;

      case 3:
        return !!this.formData.imagingVolume;

      case 4:
      return this.formData.modalities.length > 0;

      case 5:
        return !!this.formData.coverage;

      default:
        return false;

    }

  }

  submitForm() {

    const templateParams = {

      doctor_name: this.formData.doctorName,

      center_name: this.formData.centerName,

      country: this.formData.country,

      facility_type: this.formData.facilityType,

      imaging_volume: this.formData.imagingVolume,

      modalities: this.formData.modalities.join(', '),

      coverage: this.formData.coverage

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
      this.currentStep = 1;

this.formData = {
        doctorName: '',
        centerName: '',
        country: '',
        facilityType: '',
        imagingVolume: '',
        modalities: [],
        coverage: ''
      };

    })
    .catch((error) => {

      console.error(error);

      alert('Failed to send.');

    });

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

// ==============
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
}
