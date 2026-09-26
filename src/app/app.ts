import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { MessagePopupComponent } from './components/message-popup/message-popup';
import { HeartAnimationTvNlComponent } from './components/heart-animation-tv-nl/heart-animation-tv-nl.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, MessagePopupComponent, HeartAnimationTvNlComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  animations: [
    trigger('fadeInUp', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(30px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('hidden => visible', animate('1s ease-out'))
    ]),
    trigger('scaleIn', [
      state('hidden', style({
        opacity: 0,
        transform: 'scale(0.8)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('hidden => visible', animate('0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)'))
    ])
  ]
})
export class App implements OnInit {
  protected readonly title = signal('women-day-celebration');
  
  showPopup: boolean = false;
  showHeartTVNLModal: boolean = false;
  isContentVisible: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Hiển thị nội dung sau một chút delay để tạo hiệu ứng
    setTimeout(() => {
      this.isContentVisible = true;
    }, 500);
  }

  /**
   * Hiển thị popup lời chúc
   */
  showMessagePopup() {
    this.showPopup = true;
  }

  /**
   * Đóng popup
   */
  closeMessagePopup() {
    this.showPopup = false;
  }

  
  /**
   * Hiển thị heart TV NL modal fullscreen
   */
  showHeartTVNLModalPopup() {
    this.showPopup = false;
    this.showHeartTVNLModal = true;
  }

  /**
   * Đóng heart TV NL modal
   */
  closeHeartTVNLModal() {
    this.showHeartTVNLModal = false;
  }

  /**
   * Kiểm tra xem có đang ở trang heart không
   */
  isHeartPage(): boolean {
    return this.router.url === '/heart';
  }

  /**
   * Kiểm tra xem có đang ở trang home không
   */
  isHomePage(): boolean {
    return this.router.url === '/home' || this.router.url === '/';
  }

  /**
   * Điều hướng đến trang trái tim đơn giản
   */
  goToSimpleHeart() {
    this.router.navigate(['/simple-heart']);
  }

  /**
   * Điều hướng đến trang trái tim động NL
   */
  goToHeartNL() {
    this.router.navigate(['/heart-nl']);
  }

  /**
   * Điều hướng đến trang trái tim TV NL
   */
  goToHeartTVNL() {
    this.router.navigate(['/heart-tv-nl']);
  }
}