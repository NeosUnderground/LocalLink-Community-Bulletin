import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { Post } from '../../models/post.model';
import { RouterModule } from '@angular/router';
import { PostCardComponent } from '../../components/post-card/post-card';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, RouterModule, PostCardComponent],
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.scss']
})
export class ProfilePageComponent implements OnInit {
  user: any = null;
  userPosts: Post[] = [];

  constructor(private authService: AuthService, private postService: PostService) {}

ngOnInit() {
  this.authService.user$.subscribe(user => {
    this.user = user;
    if (user) {
      this.postService.getPosts().subscribe(posts => {
        this.userPosts = posts.filter(p => p.user?.id === user.uid);
      });
    }
  });
}

  deletePost(id: string) {
    this.postService.deletePost(id);
    this.userPosts = this.userPosts.filter(p => p.id !== id);
  }
}
