import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-heart-animation-tv-nl',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './heart-animation-tv-nl.component.html',
  styleUrls: ['./heart-animation-tv-nl.component.css']
})
export class HeartAnimationTvNlComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heartCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() isModal: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animationId!: number;
  private particles: Particle[] = [];
  private mouseX = 0;
  private mouseY = 0;
  private time = 0;
  showText = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.startTextAnimation();
    if (!this.isModal) {
      this.forceFullscreen();
    }
  }

  /**
   * Force fullscreen và loại bỏ scrollbars
   */
  private forceFullscreen() {
    // Loại bỏ scrollbars
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Đảm bảo body và html không có margin/padding
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    
    // Set viewport meta tag nếu chưa có
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  }

  /**
   * Restore scrollbars khi component bị destroy
   */
  private restoreScrollbars() {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.margin = '';
    document.body.style.padding = '';
    document.documentElement.style.margin = '';
    document.documentElement.style.padding = '';
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit called, isModal:', this.isModal);
    
    this.initCanvas();
    this.createParticles();
    this.startAnimation();
    
    // Force resize after a short delay to ensure DOM is ready
    setTimeout(() => {
      console.log('Resizing canvas after delay...');
      this.resizeCanvas();
    }, 100);
    
    // Additional resize for mobile
    setTimeout(() => {
      console.log('Additional resize for mobile...');
      this.resizeCanvas();
    }, 500);
    
    // Hide loading animation
    setTimeout(() => {
      const container = document.querySelector('.heart-animation-container');
      if (container) {
        container.classList.add('loaded');
        console.log('Loading animation hidden');
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (!this.isModal) {
      this.restoreScrollbars();
    }
  }

  /**
   * Khởi tạo Canvas
   */
  private initCanvas() {
    console.log('Initializing canvas...');
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
    
    if (!this.ctx) {
      console.error('Failed to get 2D context');
      return;
    }
    
    console.log('Canvas initialized:', {
      canvas: this.canvas,
      ctx: this.ctx,
      canvasWidth: this.canvas.width,
      canvasHeight: this.canvas.height
    });
    
    // Set canvas size
    this.resizeCanvas();
    window.addEventListener('resize', () => {
      console.log('Window resized, resizing canvas...');
      this.resizeCanvas();
    });
  }

  /**
   * Resize canvas theo kích thước màn hình
   */
  private resizeCanvas() {
    // Sử dụng window dimensions thay vì getBoundingClientRect
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size với device pixel ratio
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    
    // Scale context để đảm bảo sharp rendering
    this.ctx.scale(dpr, dpr);
    
    // Set CSS size để đảm bảo canvas phủ toàn bộ viewport
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    
    // Force canvas to be visible
    this.canvas.style.display = 'block';
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.zIndex = '1';
    
    console.log('Canvas resized:', { 
      width, 
      height, 
      dpr, 
      canvasWidth: this.canvas.width, 
      canvasHeight: this.canvas.height,
      canvasStyleWidth: this.canvas.style.width,
      canvasStyleHeight: this.canvas.style.height,
      isModal: this.isModal
    });
  }

  /**
   * Tạo hệ thống particle
   */
  private createParticles() {
    for (let i = 0; i < 80; i++) {
      this.particles.push(new Particle(
        Math.random() * this.canvas.width,
        Math.random() * this.canvas.height,
        Math.random() * 3 - 1.5,
        Math.random() * 3 - 1.5,
        Math.random() * 4 + 2
      ));
    }
  }

  /**
   * Bắt đầu animation loop
   */
  private startAnimation() {
    const animate = () => {
      this.update();
      this.draw();
      this.time += 0.016;
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  /**
   * Cập nhật trạng thái animation
   */
  private update() {
    // Cập nhật particles
    this.particles.forEach((particle, index) => {
      particle.update(this.mouseX, this.mouseY, this.time);
      
      // Tạo particle mới nếu cần
      if (Math.random() < 0.02) {
        this.particles[index] = new Particle(
          Math.random() * this.canvas.width,
          this.canvas.height + 10,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 3 + 1
        );
      }
    });
  }

  /**
   * Vẽ lên Canvas
   */
  private draw() {
    // Clear canvas với background gradient
    this.drawBackground();

    // Sử dụng CSS dimensions thay vì canvas dimensions để tính toán
    const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1);
    
    // Căn trái tim chính giữa màn hình
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    // Tăng kích thước trái tim để chữ có thể nằm bên trong
    const heartSize = Math.min(canvasWidth, canvasHeight) * 0.35;

    console.log('Drawing heart:', { 
      canvasWidth, 
      canvasHeight, 
      centerX, 
      centerY, 
      heartSize,
      isModal: this.isModal 
    });

    // Vẽ glow layers
    this.drawGlowLayers(centerX, centerY, heartSize);

    // Vẽ sparkles xung quanh trái tim
    this.drawSparkles(centerX, centerY, heartSize);

    // Vẽ trái tim
    this.drawHeart(centerX, centerY, heartSize);

    // Vẽ particles
    this.drawParticles();
  }

  /**
   * Vẽ background gradient để đảm bảo không có vùng tối
   */
  private drawBackground() {
    // Đảm bảo canvas được fill toàn bộ
    const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1);
    
    // Clear canvas trước
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    const gradient = this.ctx.createRadialGradient(
      canvasWidth / 2, canvasHeight / 2, 0,
      canvasWidth / 2, canvasHeight / 2, Math.max(canvasWidth, canvasHeight)
    );
    gradient.addColorStop(0, '#2d0a2d');
    gradient.addColorStop(0.3, '#1a0a1a');
    gradient.addColorStop(0.6, '#0a0a0a');
    gradient.addColorStop(1, '#000000');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    console.log('Background drawn:', { canvasWidth, canvasHeight });
  }

  /**
   * Vẽ các lớp glow - phủ toàn bộ màn hình
   */
  private drawGlowLayers(centerX: number, centerY: number, heartSize: number) {
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    const maxDimension = Math.max(canvasWidth, canvasHeight);
    
    // Tạo glow layers lớn hơn để phủ toàn bộ màn hình
    const glowSizes = [
      maxDimension * 0.8,   // 80% màn hình
      maxDimension * 1.2,    // 120% màn hình  
      maxDimension * 1.6,    // 160% màn hình
      maxDimension * 2.0     // 200% màn hình
    ];
    const glowOpacities = [0.3, 0.2, 0.15, 0.1];
    const pulseFactor = 1 + Math.sin(this.time * 2) * 0.05;

    glowSizes.forEach((size, index) => {
      const gradient = this.ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, size * pulseFactor
      );
      gradient.addColorStop(0, `rgba(255, 105, 180, ${glowOpacities[index]})`);
      gradient.addColorStop(0.2, `rgba(255, 20, 147, ${glowOpacities[index] * 0.9})`);
      gradient.addColorStop(0.4, `rgba(220, 20, 60, ${glowOpacities[index] * 0.7})`);
      gradient.addColorStop(0.6, `rgba(139, 0, 0, ${glowOpacities[index] * 0.5})`);
      gradient.addColorStop(0.8, `rgba(75, 0, 0, ${glowOpacities[index] * 0.3})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, size * pulseFactor, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  /**
   * Vẽ trái tim bằng mathematical heart curve
   */
  private drawHeart(centerX: number, centerY: number, size: number) {
    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    
    // Thêm hiệu ứng breathing
    const breathingFactor = 1 + Math.sin(this.time * 3) * 0.05;
    const scaledSize = size * breathingFactor;
    
    // Heart curve: x = 16sin³(t), y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
    this.ctx.beginPath();
    for (let t = 0; t <= Math.PI * 2; t += 0.005) {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      
      const scaledX = x * scaledSize / 32;
      const scaledY = y * scaledSize / 32;
      
      if (t === 0) {
        this.ctx.moveTo(scaledX, scaledY);
      } else {
        this.ctx.lineTo(scaledX, scaledY);
      }
    }
    
    // Tạo gradient phức tạp hơn cho trái tim
    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, scaledSize);
    gradient.addColorStop(0, '#ff69b4');
    gradient.addColorStop(0.3, '#ff1493');
    gradient.addColorStop(0.6, '#dc143c');
    gradient.addColorStop(0.8, '#b22222');
    gradient.addColorStop(1, '#8b0000');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    
    // Thêm multiple glow effects với shadowBlur reset
    this.ctx.shadowColor = '#ff69b4';
    this.ctx.shadowBlur = 30;
    this.ctx.fill();
    
    this.ctx.shadowColor = '#ff1493';
    this.ctx.shadowBlur = 20;
    this.ctx.fill();
    
    this.ctx.shadowColor = '#dc143c';
    this.ctx.shadowBlur = 15;
    this.ctx.fill();
    
    // Reset shadow để tránh ảnh hưởng đến các element khác
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
    
    console.log('Heart drawn at:', { centerX, centerY, scaledSize });
    
    this.ctx.restore();
  }

  /**
   * Vẽ sparkles xung quanh trái tim
   */
  private drawSparkles(centerX: number, centerY: number, heartSize: number) {
    const sparkleCount = 12;
    const radius = heartSize * 1.5;
    
    for (let i = 0; i < sparkleCount; i++) {
      const angle = (i / sparkleCount) * Math.PI * 2 + this.time * 0.5;
      const sparkleRadius = radius + Math.sin(this.time * 2 + i) * 20;
      const x = centerX + Math.cos(angle) * sparkleRadius;
      const y = centerY + Math.sin(angle) * sparkleRadius;
      
      const sparkleSize = 3 + Math.sin(this.time * 3 + i) * 2;
      const opacity = 0.6 + Math.sin(this.time * 4 + i) * 0.4;
      
      this.ctx.save();
      this.ctx.globalAlpha = opacity;
      this.ctx.fillStyle = '#ff69b4';
      this.ctx.shadowColor = '#ff69b4';
      this.ctx.shadowBlur = 10;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, sparkleSize, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.restore();
    }
  }

  /**
   * Vẽ particles
   */
  private drawParticles() {
    this.particles.forEach(particle => {
      particle.draw(this.ctx, this.time);
    });
  }

  /**
   * Bắt đầu animation cho text
   */
  private startTextAnimation() {
    console.log('Starting text animation...');
    setTimeout(() => {
      this.showText = true;
      console.log('Text should be visible now');
    }, 1000);

    setInterval(() => {
      this.showText = !this.showText;
      setTimeout(() => {
        this.showText = true;
      }, 100);
    }, 3000);
  }

  /**
   * Xử lý mouse move
   */
  onMouseMove(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
  }

  /**
   * Xử lý mouse leave
   */
  onMouseLeave() {
    this.mouseX = this.canvas.width / 2;
    this.mouseY = this.canvas.height / 2;
  }

  /**
   * Quay lại trang chủ hoặc đóng modal
   */
  goBack() {
    if (this.isModal) {
      this.closeModal.emit();
    } else {
      this.router.navigate(['/home']);
    }
  }
}

/**
 * Particle class cho hiệu ứng hạt sáng
 */
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;

  constructor(x: number, y: number, vx: number, vy: number, size: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.opacity = Math.random() * 0.8 + 0.2;
    this.life = 0;
    this.maxLife = Math.random() * 200 + 100;
  }

  update(mouseX: number, mouseY: number, time: number) {
    // Physics
    this.x += this.vx;
    this.y += this.vy;
    
    // Gravity
    this.vy += 0.02;
    
    // Mouse attraction
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 100) {
      const force = (100 - distance) / 100;
      this.vx += (dx / distance) * force * 0.1;
      this.vy += (dy / distance) * force * 0.1;
    }
    
    // Wind effect
    this.vx += Math.sin(time + this.x * 0.01) * 0.01;
    
    // Life cycle
    this.life++;
    this.opacity = (1 - this.life / this.maxLife) * 0.8;
    
    // Reset if dead
    if (this.life > this.maxLife) {
      this.x = Math.random() * window.innerWidth;
      this.y = window.innerHeight + 10;
      this.vx = Math.random() * 2 - 1;
      this.vy = Math.random() * 2 - 1;
      this.life = 0;
      this.maxLife = Math.random() * 200 + 100;
    }
  }

  draw(ctx: CanvasRenderingContext2D, time: number) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    
    // Thêm hiệu ứng twinkle
    const twinkle = Math.sin(time * 5 + this.x * 0.01) * 0.3 + 0.7;
    const currentSize = this.size * twinkle;
    
    // Tạo gradient phức tạp hơn cho particle
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, currentSize
    );
    gradient.addColorStop(0, '#ff69b4');
    gradient.addColorStop(0.3, '#ff1493');
    gradient.addColorStop(0.6, '#dc143c');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Thêm multiple glow effects
    ctx.shadowColor = '#ff69b4';
    ctx.shadowBlur = 15;
    ctx.fill();
    
    ctx.shadowColor = '#ff1493';
    ctx.shadowBlur = 10;
    ctx.fill();
    
    ctx.shadowColor = '#dc143c';
    ctx.shadowBlur = 5;
    ctx.fill();
    
    ctx.restore();
  }
}
