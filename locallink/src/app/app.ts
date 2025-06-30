import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { PostCardComponent } from './components/post-card/post-card';
import { Post } from './models/post.model';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './services/auth.service';
import { User } from 'firebase/auth';
import { HeaderComponent } from './components/header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, PostCardComponent,HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
   providers: [CookieService] 
})
export class App {

   user: User | null = null;

  constructor(private authService: AuthService) {
    const stored = localStorage.getItem('currentUser');
    this.user = stored ? JSON.parse(stored) : null;
  }

  login() {
    this.authService.loginWithGoogle().then(() => {
      this.user = this.authService.getUser();
    });
  }

  logout() {
    this.authService.logout().then(() => {
      this.user = null;
    });
  }
}
