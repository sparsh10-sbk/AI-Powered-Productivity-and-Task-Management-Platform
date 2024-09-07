import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideHttpClient } from '@angular/common/http';  // Add this
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';

// bootstrapApplication(AppComponent, {
//   ...appConfig,
//   providers: [provideHttpClient()]  // Ensure HttpClient is provided
// }).catch(err => console.error(err));

