import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-message-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-popup.html',
  styleUrls: ['./message-popup.css'],
  animations: [
    trigger('popupAnimation', [
      state('hidden', style({
        opacity: 0,
        transform: 'scale(0.95) translateY(15px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'scale(1) translateY(0)'
      })),
      transition('hidden => visible', animate('0.4s cubic-bezier(0.16, 1, 0.3, 1)')),
      transition('visible => hidden', animate('0.25s ease-out'))
    ])
  ]
})
export class MessagePopupComponent implements OnInit, OnDestroy {
  @Input() isVisible: boolean = false;
  @Output() closePopup = new EventEmitter<void>();
  @Output() openHeartTVNLModal = new EventEmitter<void>();

  constructor(private router: Router) {}

  // Danh sách hình ảnh kỷ niệm
  images: string[] = [
    'Image/MQ.jpg',
    'Image/z7129151530303_bcb9750dbf932d887b1664856af2f823.jpg',
    'Image/z7129151540741_1a681b2f10fcebdb941e0e0cba01a3ab.jpg',
    'Image/z7129151552947_bafbf156bdcf06e686a868c7f576eb2e.jpg',
    'Image/z7129151563815_b383d0cdaadf21f072a292da2bce8711.jpg',
    'Image/z7129151573244_013b3d06db4e423d2ef95bdb2fb20380.jpg',
    'Image/z7129151587131_6d674cf08cd69fb7a9f35f2e899f6ca5.jpg'
  ];

  currentSlideIndex: number = 0;
  currentStep: number = 0;
  private autoSlideInterval: any;

  // Danh sách các bước trong món quà
  steps: string[] = [
    'Chào mừng',
    'Khoảnh khắc',
    'Lời chúc',
    'Kỷ niệm',
    'Món quà'
  ];

  // Danh sách kỷ niệm ngọt ngào
  memories: any[] = [
    {
      icon: '🌸',
      title: 'Lần đầu gặp em',
      description: 'Khoảnh khắc anh nhìn thấy nụ cười của em, trái tim anh đã biết mình thuộc về nơi đâu.'
    },
    {
      icon: '🌙',
      title: 'Những đêm tâm sự',
      description: 'Những cuộc trò chuyện không bao giờ dứt, từng câu chuyện nhỏ gom lại thành tình yêu lớn.'
    },
    {
      icon: '🤍',
      title: 'Lời hứa từ trái tim',
      description: 'Anh sẽ luôn ở đây, đồng hành, che chở và dành trọn những điều dịu dàng nhất cho em.'
    }
  ];

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  handleImageError(event: any) {
    // Nếu ảnh chưa tải được, chuyển fallback về ảnh mặc định MQ.jpg
    if (event.target.src.indexOf('Image/MQ.jpg') === -1) {
      event.target.src = 'Image/MQ.jpg';
    }
  }

  goToStep(index: number) {
    if (index >= 0 && index < this.steps.length) {
      this.currentStep = index;
      if (this.currentStep === 1) {
        this.startAutoSlide();
      } else {
        this.stopAutoSlide();
      }
    }
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      if (this.currentStep !== 1) {
        this.stopAutoSlide();
      } else {
        this.startAutoSlide();
      }
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      if (this.currentStep === 1) {
        this.startAutoSlide();
      } else {
        this.stopAutoSlide();
      }
    }
  }

  onClose() {
    this.stopAutoSlide();
    this.isVisible = false;
    this.currentStep = 0;
    this.currentSlideIndex = 0;
    setTimeout(() => {
      this.closePopup.emit();
    }, 250);
  }

  goToHeartPage() {
    this.stopAutoSlide();
    this.isVisible = false;
    this.currentStep = 0;
    this.currentSlideIndex = 0;
    this.openHeartTVNLModal.emit();
  }

  private startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 3500);
  }

  private stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  nextSlide() {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.images.length;
  }

  previousSlide() {
    this.currentSlideIndex = this.currentSlideIndex === 0 
      ? this.images.length - 1 
      : this.currentSlideIndex - 1;
  }

  goToSlide(index: number) {
    this.currentSlideIndex = index;
    this.stopAutoSlide();
    this.startAutoSlide();
  }
}