
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Include FormsModule for form handling
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    if (this.username === '' || this.password === '' || this.confirmPassword === '') {
      alert('All fields are required');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Send registration data to the backend
    this.http.post('http://localhost:5002/api/auth/register', {
      username: this.username,
      password: this.password
    }).subscribe(
      (response: any) => {
        console.log('Registration success:', response);
        alert('Registration successful! You can now log in.');
        this.router.navigate(['/login']);  // Redirect to login page on success
      },
      (error) => {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
      }
    );
  }
}
