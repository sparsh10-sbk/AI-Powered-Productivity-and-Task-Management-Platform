
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';  // Required for ngClass and other common directives
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // For ngModel
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';  // Import HttpClient
import { tap, catchError } from 'rxjs/operators';  // Import RxJS operators
import { of } from 'rxjs';  // Fallback for handling errors

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
  standalone: true,  // Standalone component
  imports: [
    CommonModule,       // Import for *ngIf, *ngFor, and ngClass
    FormsModule,        // Import for ngModel
    ReactiveFormsModule  // If you need reactive forms as well
  ]
})
export class TaskViewComponent implements OnInit, OnDestroy {
  isPriorityFormVisible: boolean = false;
  isDurationFormVisible: boolean = false;

  tasks: any[] = [];
  savedTasks: any[] = [];
  savedDurations: any[] = [];

  interval: any;  // Reference for interval

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router,
    private http: HttpClient  // Inject HttpClient for backend calls
  ) {}

  ngOnInit() {
    // Fetch tasks from backend and ensure the interval runs only on the client-side (browser)
    if (isPlatformBrowser(this.platformId)) {
      this.fetchUserData();  // Fetch user's tasks when the component is initialized
      this.decreaseDuration();
    }
  }

  ngOnDestroy() {
    // Clear the interval when the component is destroyed
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  // Fetch tasks from the backend
  fetchUserData() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please log in first');
      this.router.navigate(['/login']);
      return;
    }

    // Fetch tasks for the user from the backend
    this.http.get(`http://localhost:5002/api/tasks/${userId}`).pipe(
      tap((tasks: any) => {
        this.tasks = tasks;
        this.savedTasks = tasks;  // Populate saved tasks
        console.log('Tasks fetched:', tasks);
      }),
      catchError((error) => {
        console.error('Failed to fetch tasks:', error);
        return of([]);  // Return an empty array on error
      })
    ).subscribe();
  }

  togglePriorityForm() {
    this.isPriorityFormVisible = !this.isPriorityFormVisible;
  }

  toggleDurationForm() {
    this.isDurationFormVisible = !this.isDurationFormVisible;
  }

  // Save priorities and display them below
  savePriorities() {
    this.savedTasks = [...this.tasks];
    this.saveTasksToBackend();
  }

  // Save durations and display them below
  saveDurations() {
    this.savedDurations = [...this.tasks];
    this.saveTasksToBackend();
  }

  // Add a new task to the form dynamically
  addTask() {
    this.tasks.push({ description: '', priority: 0, timeLeft: 0, completed: false });
  }

  // Remove a task from the form and saved lists
  removeTask(index: number) {
    const taskToDelete = this.tasks[index];
    this.tasks.splice(index, 1);
    this.savedTasks = this.savedTasks.filter((_, i) => i !== index);
    this.savedDurations = this.savedDurations.filter((_, i) => i !== index);
    this.deleteTaskFromBackend(taskToDelete);  // Delete task from backend
  }

  completeTask(task: any) {
    task.completed = true;
    setTimeout(() => {
      this.savedTasks = this.savedTasks.filter(t => t !== task);
      this.saveTasksToBackend();
    }, 5000);
  }

  // Delete a task
  deleteTask(task: any) {
    this.savedTasks = this.savedTasks.filter(t => t !== task);
    this.deleteTaskFromBackend(task);  // Delete task from backend
  }

  // Decrease the duration every day automatically (animation)
  decreaseDuration() {
    this.interval = setInterval(() => {
      this.savedDurations.forEach((task) => {
        if (task.timeLeft > 0) {
          task.timeLeft -= 1;
        }
      });
    }, 86400000); // Run every 24 hours (1 day)
  }

  // Save tasks to the backend (Create/Update)
  saveTasksToBackend() {
    const userId = localStorage.getItem('userId');
    this.http.post(`http://localhost:5002/api/tasks/${userId}`, this.savedTasks).pipe(
      tap((response) => {
        console.log('Tasks saved:', response);
      }),
      catchError((error) => {
        console.error('Failed to save tasks:', error);
        return of(null);  // Return fallback value on error
      })
    ).subscribe();
  }

  // Delete a task from the backend
  deleteTaskFromBackend(task: any) {
    const userId = localStorage.getItem('userId');
    this.http.delete(`http://localhost:5002/api/tasks/${userId}/${task._id}`).pipe(
      tap((response) => {
        console.log('Task deleted:', response);
      }),
      catchError((error) => {
        console.error('Failed to delete task:', error);
        return of(null);  // Return fallback value on error
      })
    ).subscribe();
  }

  // Navigation functions
  goToNewsfeed() {
    this.router.navigate(['/newsfeed']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
