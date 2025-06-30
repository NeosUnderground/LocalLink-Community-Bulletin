import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home';
import { NewPostPageComponent } from './pages/new-post/new-post';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  { path: 'new',
    component: NewPostPageComponent 
  },
  { path: 'edit/:id', 
    component: NewPostPageComponent 
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile-page/profile-page').then(m => m.ProfilePageComponent)
  }

];
