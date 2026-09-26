import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Settings
const settings = {
  particles: {
    length: 10000, // maximum amount of particles
    duration: 3.5, // particle duration in sec
    velocity: 100, // particle velocity in pixels/sec
    effect: -1.5, // play with this for a nice effect
    size: 8, // particle size in pixels
  },
};

/* Point helper class */
class Point {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  clone(): Point {
    return new Point(this.x, this.y);
  }

  length(length?: number): number | Point {
    if (typeof length === 'undefined') {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    this.normalize();
    this.x *= length;
    this.y *= length;
    return this;
  }

  normalize(): Point {
    const length = Math.sqrt(this.x * this.x + this.y * this.y);
    if (length !== 0) {
      this.x /= length;
      this.y /= length;
    }
    return this;
  }
}

/* Particle helper class */
class Particle {
  position = new Point();
  velocity = new Point();
  acceleration = new Point();
  age = 0;

  initialize(x: number, y: number, dx: number, dy: number) {
    this.position.x = x;
    this.position.y = y;
    this.velocity.x = dx;
    this.velocity.y = dy;
    this.acceleration.x = dx * settings.particles.effect;
    this.acceleration.y = dy * settings.particles.effect;
    this.age = 0;
  }

  update(deltaTime: number) {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    this.velocity.x += this.acceleration.x * deltaTime;
    this.velocity.y += this.acceleration.y * deltaTime;
    this.age += deltaTime;
  }

  draw(context: CanvasRenderingContext2D, image: HTMLImageElement | HTMLCanvasElement) {
    function ease(t: number) {
      return --t * t * t + 1;
    }
    const size = image.width * ease(this.age / settings.particles.duration);
    context.globalAlpha = Math.max(0, 1 - this.age / settings.particles.duration);
    context.drawImage(
      image,
      this.position.x - size / 2,
      this.position.y - size / 2,
      size,
      size
    );
  }
}

/* ParticlePool circular queue */
class ParticlePool {
  private particles: Particle[];
  private firstActive = 0;
  private firstFree = 0;
  private duration = settings.particles.duration;

  constructor(length: number) {
    this.particles = new Array(length);
    for (let i = 0; i < length; i++) {
      this.particles[i] = new Particle();
    }
  }

  add(x: number, y: number, dx: number, dy: number) {
    this.particles[this.firstFree].initialize(x, y, dx, dy);

    this.firstFree++;
    if (this.firstFree === this.particles.length) this.firstFree = 0;
    if (this.firstActive === this.firstFree) this.firstActive++;
    if (this.firstActive === this.particles.length) this.firstActive = 0;
  }

  update(deltaTime: number) {
    if (this.firstActive < this.firstFree) {
      for (let i = this.firstActive; i < this.firstFree; i++) {
        this.particles[i].update(deltaTime);
      }
    }
    if (this.firstFree < this.firstActive) {
      for (let i = this.firstActive; i < this.particles.length; i++) {
        this.particles[i].update(deltaTime);
      }
      for (let i = 0; i < this.firstFree; i++) {
        this.particles[i].update(deltaTime);
      }
    }

    while (
      this.particles[this.firstActive].age >= this.duration &&
      this.firstActive !== this.firstFree
    ) {
      this.firstActive++;
      if (this.firstActive === this.particles.length) this.firstActive = 0;
    }
  }

  draw(context: CanvasRenderingContext2D, image: HTMLImageElement | HTMLCanvasElement) {
    if (this.firstActive < this.firstFree) {
      for (let i = this.firstActive; i < this.firstFree; i++) {
        this.particles[i].draw(context, image);
      }
    }
    if (this.firstFree < this.firstActive) {
      for (let i = this.firstActive; i < this.particles.length; i++) {
        this.particles[i].draw(context, image);
      }
      for (let i = 0; i < this.firstFree; i++) {
        this.particles[i].draw(context, image);
      }
    }
  }
}

// Point on heart parametric curve
function pointOnHeart(t: number): Point {
  return new Point(
    160 * Math.pow(Math.sin(t), 3),
    130 * Math.cos(t) -
      50 * Math.cos(2 * t) -
      20 * Math.cos(3 * t) -
      10 * Math.cos(4 * t) +
      25
  );
}

// Create offscreen sprite for the heart particle
function createHeartImage(): HTMLImageElement {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.width = settings.particles.size;
  canvas.height = settings.particles.size;

  function to(t: number): Point {
    const point = pointOnHeart(t);
    point.x = settings.particles.size / 2 + (point.x * settings.particles.size) / 350;
    point.y = settings.particles.size / 2 - (point.y * settings.particles.size) / 350;
    return point;
  }

  context.beginPath();
  let t = -Math.PI;
  let point = to(t);
  context.moveTo(point.x, point.y);
  while (t < Math.PI) {
    t += 0.01;
    point = to(t);
    context.lineTo(point.x, point.y);
  }
  context.closePath();
  context.fillStyle = '#FF5CA4';
  context.fill();

  const image = new Image();
  image.src = canvas.toDataURL();
  return image;
}

@Component({
  selector: 'app-heart-animation-tv-nl',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './heart-animation-tv-nl.component.html',
  styleUrls: ['./heart-animation-tv-nl.component.css']
})
export class HeartAnimationTvNlComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('pinkboardCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() isModal: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;
  private animationId: number = 0;
  private particles!: ParticlePool;
  private particleRate = settings.particles.length / settings.particles.duration;
  private heartImage!: HTMLImageElement;
  private lastTime = 0;
  private isRunning = false;

  constructor(private router: Router) {}

  ngOnInit() {
    if (!this.isModal) {
      this.forceFullscreen();
    }
  }

  private forceFullscreen() {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  private restoreScrollbars() {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.context = this.canvas.getContext('2d')!;
    this.particles = new ParticlePool(settings.particles.length);
    this.heartImage = createHeartImage();
    this.isRunning = true;

    this.onResize();
    window.addEventListener('resize', this.onResize);

    setTimeout(() => {
      this.onResize();
      this.lastTime = new Date().getTime() / 1000;
      this.render();
    }, 10);
  }

  ngOnDestroy() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.onResize);
    if (!this.isModal) {
      this.restoreScrollbars();
    }
  }

  onResize = () => {
    if (this.canvas) {
      this.canvas.width = this.canvas.clientWidth || 600;
      this.canvas.height = this.canvas.clientHeight || 600;
    }
  };

  render = () => {
    if (!this.isRunning) return;

    this.animationId = requestAnimationFrame(this.render);

    const newTime = new Date().getTime() / 1000;
    const deltaTime = newTime - (this.lastTime || newTime);
    this.lastTime = newTime;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const amount = this.particleRate * deltaTime;
    for (let i = 0; i < amount; i++) {
      const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
      const dir = pos.clone().length(settings.particles.velocity) as Point;
      this.particles.add(
        this.canvas.width / 2 + pos.x,
        this.canvas.height / 2 - pos.y,
        dir.x,
        -dir.y
      );
    }

    this.particles.update(deltaTime);
    this.particles.draw(this.context, this.heartImage);
  };

  goBack() {
    if (this.isModal) {
      this.closeModal.emit();
    } else {
      this.router.navigate(['/home']);
    }
  }
}
