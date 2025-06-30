import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { PostService } from '../../services/post.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../models/post.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-post.html',
  styleUrls: ['./new-post.scss']
})
export class NewPostPageComponent implements OnInit {
  postForm!: FormGroup;
  editingId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      contact: ['', [Validators.pattern(/^\d{10}$/)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const existing = this.postService.getPostById(id);
      if (existing) {
        this.editingId = id;
        this.postForm.patchValue(existing);
      }
    }
  }

  async useMyLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation not supported.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${lat}&longitude=${lng}&localityLanguage=en&key=bdc_f27a84f47d504dd98958d2ed0d3a272e`
          );

          if (!res.ok) {
            throw new Error(`Geocoding failed: ${res.status}`);
          }

          const data = await res.json();
          console.log('Geocode response:', data);

          const zip = data.postcode;
          if (zip) {
            this.postForm.patchValue({ zip });
          } else {
            alert('Could not determine ZIP from location.');
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          alert('Failed to reverse geocode your location.');
        }
      },
      (err) => alert('Location error: ' + err.message)
    );
  }
  
  

  onSubmit() {
    if (this.postForm.invalid) return;

    const post = this.postForm.value as Post;

    const zipToCoords: { [zip: string]: { lat: number; lng: number } } = {
      '80538': { lat: 40.3955, lng: -105.0746 }, // Loveland
      '80501': { lat: 40.1672, lng: -105.1019 }, // Longmont
      '80521': { lat: 40.5853, lng: -105.0844 }, // Fort Collins
      '80014': { lat: 39.7392, lng: -104.9903 }, // Denver
      '80537': { lat: 40.4066, lng: -105.0749 }  // Loveland Alt
    };

    const coords = zipToCoords[post.zip];
    if (coords) {
      post.lat = coords.lat;
      post.lng = coords.lng;
    } else {
      alert('Note: ZIP is not mapped to coordinates, so location will be missing.');
    }

const user = this.authService.getUser();

post.user = user
  ? { id: user.uid, name: user.displayName ?? 'Anonymous' }
  : { id: 'anonymous', name: 'Anonymous' };

  console.log('Saved post:', post);

    if (this.editingId) {
      post.id = this.editingId;
      post.createdAt = new Date(); // You might preserve the original timestamp
      this.postService.updatePost(post);
      alert('Post updated!');
    } else {
      this.postService.addPost(post);
      alert('Post submitted!');
    }



    this.router.navigateByUrl('/');
  }
}
