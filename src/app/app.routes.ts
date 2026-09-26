import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page';
import { HeartAnimationTvNlComponent } from './components/heart-animation-tv-nl/heart-animation-tv-nl.component';

export const routes: Routes = [
  { path: 'heart-tv-nl', component: HeartAnimationTvNlComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: '**', redirectTo: '/home' }
];
