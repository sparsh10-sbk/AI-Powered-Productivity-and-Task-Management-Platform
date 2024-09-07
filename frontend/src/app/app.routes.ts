
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

 // Import HttpClientModule

import { TaskViewComponent } from './pages/task-view/task-view.component';
import { NewsfeedComponent } from './pages/newsfeed/newsfeed.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component'; 

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {path: 'task',component:TaskViewComponent} , // Default path for Task View
  { path: 'newsfeed', component: NewsfeedComponent },  // Route for Newsfeed page
  { path: 'login', component: LoginComponent },
  {path: 'register', component: RegisterComponent}, // Route for Login page
  { path: '**', redirectTo: '' }  // Redirect any unknown paths to Task View
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
   // Include HttpClientModule to use HttpClient in the app
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }


