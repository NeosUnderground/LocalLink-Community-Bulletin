import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';



@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-bar.html',
  styleUrls: ['./filter-bar.scss']
})
export class FilterBarComponent {
  searchTerm = '';
  zip = '';
  category = '';
  radius = 10;
  userLat: number | null = null;
  userLng: number | null = null;

  private searchSubject = new Subject<string>();
  private cookieService = inject(CookieService);
  

  @Output() filtersChanged = new EventEmitter<{
    search: string;
    zip: string;
    category: string;
    radius: number;
    userLat: number | null;
    userLng: number | null;
  }>();

constructor( cookieService: CookieService) {
  this.searchSubject.pipe(debounceTime(300)).subscribe(() => this.emitFilters());

  // Load saved location
  const savedLat = this.cookieService.get('userLat');
  const savedLng = this.cookieService.get('userLng');
  if (savedLat && savedLng) {
    this.userLat = parseFloat(savedLat);
    this.userLng = parseFloat(savedLng);
  }
}
  onSearchChange() {
    this.searchSubject.next(this.searchTerm);
  }

  onRadiusChange() {
    this.emitFilters();
  }

  useMyLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.userLat = position.coords.latitude;
        this.userLng = position.coords.longitude;
        this.emitFilters();
        this.cookieService.set('userLat', String(this.userLat));
        this.cookieService.set('userLng', String(this.userLng));
      },
      (error) => {
        alert('Failed to get location: ' + error.message);
      }
    );
  }

  private zipToCoordinates(zip: string): { lat: number; lng: number } | null {
  const zipMap: Record<string, { lat: number; lng: number }> = {
    '75001': { lat: 32.9618, lng: -96.8360 },
    '90210': { lat: 34.0901, lng: -118.4065 },
    '10001': { lat: 40.7506, lng: -73.9972 }
  };
  return zipMap[zip] || null;
}


  emitFilters() {
    this.filtersChanged.emit({
      search: this.searchTerm.trim(),
      zip: this.zip.trim(),
      category: this.category,
      radius: this.radius,
      userLat: this.userLat,
      userLng: this.userLng
    });
    if (!this.userLat && this.zip) {
      const coords = this.zipToCoordinates(this.zip);
      if (coords) {
        this.userLat = coords.lat;
        this.userLng = coords.lng;
      }
    }
  }

  resetFilters() {
    this.searchTerm = '';
    this.zip = '';
    this.category = '';
    this.radius = 10;
    this.userLat = null;
    this.userLng = null;

    // Clear cookies too if they were set
    this.cookieService.delete('userLat');
    this.cookieService.delete('userLng');

    this.emitFilters();
  }

}
