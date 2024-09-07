
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';  
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';  
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-newsfeed',
  standalone: true,  
  imports: [CommonModule, FormsModule],  
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.scss']
})
export class NewsfeedComponent implements OnInit {
  interests: string[] = [];
  newsfeed: any[] = [];
  newInterest = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any  // Inject PLATFORM_ID to check for SSR
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchInterests();  // Fetch interests only in the browser
    }
  }

  // Fetch interests from backend
  fetchInterests() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please log in first');
      this.router.navigate(['/login']);
      return;
    }

    // Fetch interests for the user from the backend
    this.http.get(`http://localhost:5002/api/interests/${userId}`).pipe(
      tap((interests: any) => {
        this.interests = interests || [];
        this.fetchNews();  // Fetch news based on interests
        console.log('Interests fetched:', this.interests);
      }),
      catchError((error) => {
        console.error('Failed to fetch interests:', error);
        return of([]);  // Return empty interests on error
      })
    ).subscribe();
  }

  // Fetch news based on interests
  fetchNews() {
    if (this.interests.length === 0) {
      this.newsfeed = [];  // If no interests, don't fetch news
      return;
    }

    const interestString = this.interests.join(',');  // Join interests to form a comma-separated string
    const url = `https://newsapi.org/v2/top-headlines?category=${interestString}&apiKey=YOUR_API_KEY`;  // Replace with actual API key
    
    this.http.get(url).pipe(
      catchError(error => {
        console.error('Error fetching news:', error);
        return of([]);  // Return empty newsfeed on error
      })
    ).subscribe((data: any) => {
      console.log('API Response:', data);
      this.newsfeed = data.articles || [];
    });
  }

  // Add a new interest
  addInterest() {
    if (this.newInterest && !this.interests.includes(this.newInterest)) {
      this.interests.push(this.newInterest);
      this.saveInterestsToBackend();  // Save to backend
      this.newInterest = '';
      this.fetchNews();  // Fetch news based on updated interests
    }
  }

  // Remove an interest
  removeInterest(interest: string) {
    this.interests = this.interests.filter(item => item !== interest);
    this.saveInterestsToBackend();  // Save updated interests to backend
    this.fetchNews();  // Fetch news based on updated interests
  }


  saveInterestsToBackend() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID is missing from localStorage.');
      return;
    }
  
    this.http.post(`http://localhost:5002/api/interests/${userId}`, { interests: this.interests }).pipe(
      tap((response) => {
        console.log('Interests saved for user:', userId);
      }),
      catchError((error) => {
        console.error('Failed to save interests:', error);
        return of(null);  // Handle save error
      })
    ).subscribe();
  }
  

  // Remove a specific news article from the newsfeed
  removeNews(article: any) {
    this.newsfeed = this.newsfeed.filter(item => item !== article);
  }

  // Navigation to Task Page
  goToTasks() {
    this.router.navigate(['/task']);
  }

  // Logout function
  logout() {
    this.interests = [];
    this.newsfeed = [];
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
