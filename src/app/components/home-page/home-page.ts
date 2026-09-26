import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Home page content will be handled by app component -->
    <div></div>
  `,
  styles: []
})
export class HomePageComponent {
  constructor() {}
}
