import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import { Observable, of } from 'rxjs';

const STORAGE_KEY = 'locallink-posts';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private localPosts: Post[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      this.localPosts = JSON.parse(raw);
    }
  }

  getPosts(): Observable<Post[]> {
    return of([...this.localPosts]);
  }

  addPost(post: Post) {
    post.id = crypto.randomUUID();
    post.createdAt = new Date();
    this.localPosts.unshift(post);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.localPosts));
  }

    getPostById(id: string): Post | undefined {
        return this.localPosts.find(post => post.id === id);
    }

    updatePost(updatedPost: Post) {
    const index = this.localPosts.findIndex(p => p.id === updatedPost.id);
        if (index !== -1) {
            this.localPosts[index] = updatedPost;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.localPosts));
        }
    }

    deletePost(id: string) {
        this.localPosts = this.localPosts.filter(p => p.id !== id);
        localStorage.setItem('locallink-posts', JSON.stringify(this.localPosts));
    }

}

