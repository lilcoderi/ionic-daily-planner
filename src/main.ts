import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { initializeApp } from 'firebase/app';
import { provideFirebaseApp, getApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from './environments/environment';
import { addIcons } from 'ionicons';
import { calendar, checkmarkCircle, createOutline, document, person, pieChartOutline, addOutline, arrowBack, barChartOutline } from 'ionicons/icons';

// Tambahkan ikon secara manual
addIcons({
  'calendar': calendar,
  'checkmark-circle': checkmarkCircle,
  'document': document,
  'person': person,
  'create-outline': createOutline,
  'add-outline': addOutline,
  'arrow-back': arrowBack,
  'bar-chart-outline': barChartOutline,
  'pie-chart-outline': pieChartOutline,
  
});

// Log konfigurasi Firebase (Opsional)
console.log('Firebase Config:', environment.firebaseConfig);

// Initialize Firebase and setup providers
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), // Initialize Firebase
    provideFirestore(() => getFirestore()), // Provide Firestore
    provideAuth(() => getAuth()), // Provide Auth
  ],
});
