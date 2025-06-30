// home.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCardComponent } from '../../components/post-card/post-card';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, PostCardComponent, FilterBarComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomePageComponent implements OnInit {
  allPosts: Post[] = [];
  filteredPosts: Post[] = [];

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  private loadPosts() {
    this.postService.getPosts().subscribe((stored) => {
      this.allPosts = [...stored, ...this.getHardcodedPosts()];
      this.filteredPosts = [...this.allPosts];
    });
  }

  private getHardcodedPosts(): Post[] {
    return [
      {
        id: '1',
        title: 'Community BBQ this Saturday!',
        description: 'Join us for food, games, and live music at the park.',
        category: 'Events',
        zip: '80538',
        createdAt: new Date(),
        isFeatured: true,
        lat: 40.3955,
        lng: -105.0746
      },
      {
        id: '2',
        title: 'Math Tutoring - All Grades',
        description: 'Experienced tutor available for private lessons in math.',
        category: 'Services',
        zip: '80501',
        createdAt: new Date(),
        isFeatured: false,
        lat: 40.5853,
        lng: -105.0844
      },
      {
        id: '3',
        title: 'Multi-Family Garage Sale!',
        description: 'Furniture, clothes, toys, tools & more. Don’t miss out!',
        category: 'For Sale',
        zip: '80521',
        createdAt: new Date(),
        isFeatured: false,
        lat: 40.1672,
        lng: -105.1019
      },
      {
        id: '4',
        title: 'Denver Multi-Family Garage Sale!',
        description: 'Furniture, clothes, toys, tools & more. Don’t miss out!',
        category: 'For Sale',
        zip: '80014',
        createdAt: new Date(),
        isFeatured: false,
        lat: 39.7392,
        lng: -104.9903
      }
    ];
  }

  onFiltersChanged(filters: {
    search: string;
    zip: string;
    category: string;
    radius: number;
    userLat: number | null;
    userLng: number | null;
  }) {
    this.filteredPosts = this.allPosts.filter((post) => {
      const matchesSearch =
        filters.search === '' ||
        post.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        post.description.toLowerCase().includes(filters.search.toLowerCase());

      const matchesZip =
        filters.zip === '' || post.zip.startsWith(filters.zip);

      const matchesCategory =
        filters.category === '' || post.category === filters.category;

      const matchesDistance =
        filters.userLat === null ||
        filters.userLng === null ||
        (post.lat !== undefined &&
          post.lng !== undefined &&
          (() => {
            const distance = this.calculateDistance(
              filters.userLat!,
              filters.userLng!,
              post.lat,
              post.lng
            );
            post.distance = distance;
            return distance <= filters.radius;
          })());

      return matchesSearch && matchesZip && matchesCategory && matchesDistance;
    });
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 3958.8;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  onDeletePost(postId: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    this.postService.deletePost(postId);
    this.allPosts = this.allPosts.filter(p => p.id !== postId);
    this.filteredPosts = this.filteredPosts.filter(p => p.id !== postId);
  }

  onToggleFavorite(postId: string) {
    const uid = this.authService.getUser()?.uid || '';
    this.postService.toggleFavorite(postId, uid);

    this.loadPosts();
  }
}
