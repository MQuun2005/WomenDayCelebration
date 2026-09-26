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
        transform: 'scale(0.3) translateY(-50px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'scale(1) translateY(0)'
      })),
      transition('hidden => visible', animate('0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)')),
      transition('visible => hidden', animate('0.3s ease-out'))
    ])
  ]
})
export class MessagePopupComponent implements OnInit, OnDestroy {
  @Input() isVisible: boolean = false;
  @Output() closePopup = new EventEmitter<void>();
  @Output() openHeartTVNLModal = new EventEmitter<void>();

  constructor(private router: Router) {}

  // Danh sách các lời chúc đặc biệt cho Nhật Linh
  private messages: string[] = [
    "Nhật Linh à, chúc em luôn xinh đẹp, hạnh phúc và thành công trong mọi việc! 💖",
    "Ngày 20/10, anh muốn nói với em rằng em là người phụ nữ tuyệt vời nhất trong cuộc đời anh! 🌸",
    "Nhật Linh ơi, chúc em có một ngày thật ý nghĩa, tràn đầy niềm vui và hạnh phúc! ✨",
    "Gửi lời chúc tốt đẹp nhất đến người con gái anh yêu thương nhất! 💕",
    "Nhật Linh à, em luôn tỏa sáng như những bông hoa đẹp nhất trong cuộc đời anh! 🌺",
    "Chúc em Nhật Linh luôn mạnh mẽ, tự tin và được yêu thương nhiều nhất! 💝",
    "Nhật Linh ơi, em là nguồn cảm hứng và niềm vui lớn nhất của anh! 🌹",
    "Chúc em có những giấc mơ đẹp và luôn được che chở, bảo vệ! 🌟"
  ];

  // Danh sách hình ảnh từ thư mục public/Image (sửa đường dẫn cho GitHub Pages)
  images: string[] = [
    'Image/z7129151530303_bcb9750dbf932d887b1664856af2f823.jpg',
    'Image/z7129151540741_1a681b2f10fcebdb941e0e0cba01a3ab.jpg',
    'Image/z7129151552947_bafbf156bdcf06e686a868c7f576eb2e.jpg',
    'Image/z7129151563815_b383d0cdaadf21f072a292da2bce8711.jpg',
    'Image/z7129151573244_013b3d06db4e423d2ef95bdb2fb20380.jpg',
    'Image/z7129151587131_6d674cf08cd69fb7a9f35f2e899f6ca5.jpg',
    'Image/z7129151599414_75874973a5ce8b3b951387b7866e2354.jpg',
    'Image/z7129151611841_6caea95adf38df1a8cc0949e980b324b.jpg',
    'Image/z7129151623706_1197c6cacf2303404cd23fc61d3034ec.jpg',
    'Image/z7129151636340_79095b36c71f2cc71adc98163d764541.jpg',
    'Image/z7129151647729_3c59e8cab3bc4d1ec216f239bb9ec00d.jpg',
    'Image/z7129151660427_2f2a069876c25fbe70d0a4facb4e6dd4.jpg',
    'Image/z7129151670125_d19282661f33126bd28db3cc68d36f87.jpg',
    'Image/z7129154915830_d6b9b3158c8ca53f693e368f3e98868b.jpg',
    'Image/z7129154923481_c52a58d795d37332bb5661d81d9fee73.jpg',
    'Image/z7129154932398_8e1952098c165815a82ae19e77b068fb.jpg',
    'Image/z7129154954870_a4634cf6182fd3619e8e6c06b8db728d.jpg',
    'Image/z7129154970729_9be62ead0926e4367500ea900f3f563.jpg',
    'Image/z7129154979859_15e15c6c89a80dae6b4959172627a6a2.jpg',
    'Image/z7129154989410_c674e847ca4833d3a5cd1a11a0216aae.jpg',
    'Image/z7129154995735_1e8a075d39b80e7076b10e2639d81a43.jpg',
    'Image/z7129155023580_fa3e6972472f7d4bd2c11ed18f840e09.jpg',
    'Image/z7129155033599_0787efbe6927b4baf5a0ed18f912b5b2.jpg'
  ];

  currentMessage: string = '';
  currentSlideIndex: number = 0;
  currentStep: number = 0;
  private autoSlideInterval: any;

  // Danh sách các step
  steps: string[] = [
    'Chào mừng',
    'Hình ảnh',
    'Lời chúc',
    'Kỉ niệm',
    'Kết thúc'
  ];

  // Danh sách kỉ niệm
  memories: any[] = [
    {
      icon: '💕',
      title: 'Lần đầu gặp em',
      description: 'Khoảnh khắc anh nhìn thấy em lần đầu tiên, trái tim anh đã rung động...'
    },
    {
      icon: '🌙',
      title: 'Những đêm trò chuyện',
      description: 'Những đêm chúng ta trò chuyện đến tận khuya, chia sẻ mọi thứ...'
    },
    {
      icon: '💍',
      title: 'Những lời hứa',
      description: 'Những lời hứa anh đã nói với em, anh sẽ luôn giữ lời...'
    }
  ];

  ngOnInit() {
    // Khởi tạo slideshow tự động
    this.startAutoSlide();
  }

  ngOnDestroy() {
    // Dọn dẹp interval khi component bị hủy
    this.stopAutoSlide();
  }

  /**
   * Hiển thị popup với step đầu tiên (luôn reset về step 0)
   */
  showMessage() {
    this.currentMessage = this.getRandomMessage();
    this.currentSlideIndex = 0;
    this.currentStep = 0; // Luôn bắt đầu từ step đầu tiên
    this.isVisible = true;
    this.startAutoSlide();
  }

  /**
   * Chuyển đến step tiếp theo
   */
  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      // Dừng auto slide khi không ở step slideshow
      if (this.currentStep !== 1) {
        this.stopAutoSlide();
      } else {
        this.startAutoSlide();
      }
    }
  }

  /**
   * Chuyển đến step trước đó
   */
  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      // Bắt đầu auto slide khi quay lại step slideshow
      if (this.currentStep === 1) {
        this.startAutoSlide();
      } else {
        this.stopAutoSlide();
      }
    }
  }

  /**
   * Đóng popup và reset về step đầu tiên
   */
  onClose() {
    this.stopAutoSlide();
    this.isVisible = false;
    // Reset về step đầu tiên
    this.currentStep = 0;
    this.currentSlideIndex = 0;
    setTimeout(() => {
      this.closePopup.emit();
    }, 300);
  }

  /**
   * Mở modal heart-animation-tv-nl khi nhấn nút cuối
   */
  goToHeartPage() {
    this.stopAutoSlide();
    this.isVisible = false;
    // Reset về step đầu tiên
    this.currentStep = 0;
    this.currentSlideIndex = 0;
    this.openHeartTVNLModal.emit();
  }

  /**
   * Bắt đầu slideshow tự động
   */
  private startAutoSlide() {
    this.stopAutoSlide(); // Đảm bảo không có interval nào đang chạy
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 3000); // Chuyển slide mỗi 3 giây
  }

  /**
   * Dừng slideshow tự động
   */
  private stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  /**
   * Chuyển đến slide tiếp theo
   */
  nextSlide() {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.images.length;
  }

  /**
   * Chuyển đến slide trước đó
   */
  previousSlide() {
    this.currentSlideIndex = this.currentSlideIndex === 0 
      ? this.images.length - 1 
      : this.currentSlideIndex - 1;
  }

  /**
   * Chuyển đến slide cụ thể
   */
  goToSlide(index: number) {
    this.currentSlideIndex = index;
    this.stopAutoSlide();
    this.startAutoSlide(); // Restart auto slide sau khi click
  }

  /**
   * Lấy một lời chúc ngẫu nhiên từ danh sách
   */
  private getRandomMessage(): string {
    const randomIndex = Math.floor(Math.random() * this.messages.length);
    return this.messages[randomIndex];
  }
}