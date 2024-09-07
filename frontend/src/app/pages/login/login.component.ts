
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Add FormsModule for ngModel
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, FormsModule]  // Import FormsModule for form handling
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  // Handle Login
 
login() {
  if (this.username && this.password) {
    this.http.post('http://localhost:5002/api/auth/login', {
      username: this.username,
      password: this.password
    }).pipe(
      tap((response: any) => {
        console.log('Login success:', response);
      
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);  
        console.log(response.userId); // Save JWT token
        this.router.navigate(['/task']);  // Redirect to task page on successful login
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        alert('Login failed. Please check your username and password.');
        return of(null);  // Return a safe fallback
      })
    ).subscribe();
  } else {
    alert('Please enter a valid username and password.');
  }
}


  // Handle Registration (Navigate to Registration Page)
 // Handle Registration (Navigate to Registration Page)
 register() {
  this.router.navigate(['/register']);  // Navigate to the new registration page
}

}
