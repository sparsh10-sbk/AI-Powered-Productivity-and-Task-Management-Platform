
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiKey = '0cadff52d5494aec83935637c07a5116';  // Replace this with your API key
  private baseUrl = 'https://newsapi.org/v2/top-headlines';

  constructor(private http: HttpClient) { }

  // Method to fetch top headlines based on a category or keyword
  getNews(category: string): Observable<any> {
    const url = `${this.baseUrl}?category=${category}&country=us&apiKey=${this.apiKey}`;
    return this.http.get(url);
  }

  // Fetch news based on a custom keyword
  getNewsByKeyword(keyword: string): Observable<any> {
    const url = `${this.baseUrl}?q=${keyword}&apiKey=${this.apiKey}`;
    return this.http.get(url);
  }
}

