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

 favoritePosts: Post[] = [];

 onToggleFavorite(postId: string) {
  const uid = this.authService.getUser()?.uid || '';
  this.postService.toggleFavorite(postId, uid);

  // Update post state locally for UI to reflect
  this.userPosts = this.userPosts.map(post => {
    if (post.id === postId) {
      const favorites = post.favorites || [];
      const isFav = favorites.includes(uid);
      return {
        ...post,
        favorites: isFav ? favorites.filter(id => id !== uid) : [...favorites, uid]
      };
    }
    return post;
  });

  this.favoritePosts = this.userPosts.filter(p => p.favorites?.includes(uid));

  this.postService.getPosts().subscribe(posts => {
    this.userPosts = posts.filter(p => p.user?.id === uid);
    this.favoritePosts = posts.filter(p => p.favorites?.includes(uid));
  });
}

ngOnInit() {
  this.authService.user$.subscribe(user => {
    this.user = user;
    if (user) {
      this.postService.getPosts().subscribe(posts => {
        this.userPosts = posts.filter(p => p.user?.id === user.uid);
       this.favoritePosts = posts.filter(post =>
          post.favorites?.includes(user.uid)
        );
      });
    }
  });
}

  deletePost(id: string) {
    this.postService.deletePost(id);
    this.userPosts = this.userPosts.filter(p => p.id !== id);
  }
  
}


