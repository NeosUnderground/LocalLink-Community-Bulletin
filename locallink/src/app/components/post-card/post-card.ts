import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../models/post.model';
import { RouterModule } from '@angular/router';
import { Output, EventEmitter } from '@angular/core';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './post-card.html',
  styleUrls: ['./post-card.scss']
})
export class PostCardComponent {
  @Input() post!: Post;
  @Output() delete = new EventEmitter<string>();
  currentUser: string;

constructor(
  private postService: PostService,
  private authService: AuthService
) {
  const user = this.authService.getUser();
  this.currentUser = user?.uid || '';
}
  
  get isOwner(): boolean {
    console.log('Current user:', this.currentUser);
    return this.post.user?.id === this.currentUser;
  }

  

  formatPhoneNumber(phone: string): string {
  return `(${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6)}`;
}
}