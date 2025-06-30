import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../models/post.model';
import { RouterModule } from '@angular/router';
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
  @Output() toggleFavorite = new EventEmitter<string>(); // ✅ emit postId to parent

  currentUser: string;

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {
    const user = this.authService.getUser();
    this.currentUser = user?.uid || '';
  }

  get isOwner(): boolean {
    return this.post.user?.id === this.currentUser;
  }

  get isFavorited(): boolean {
    return this.post.favorites?.includes(this.currentUser) ?? false;
  }

  onFavoriteClick() {
    this.toggleFavorite.emit(this.post.id!); // ✅ emit to parent component
  }

  formatPhoneNumber(phone: string): string {
    return `(${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6)}`;
  }

  format12HourTime(time24: string): string {
    const [hourStr, minute] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  }
}
