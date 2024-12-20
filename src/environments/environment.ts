// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyCb4aw5T74Rx2psGFYQrs6TMz5JFuj2TmY",
    authDomain: "daily-planner-2024.firebaseapp.com",
    projectId: "daily-planner-2024",
    storageBucket: "daily-planner-2024.appspot.com", // Corrected URL for Firebase Storage
    messagingSenderId: "271411933736",
    appId: "1:271411933736:web:d9b1eeb0cd43a2d29a7b1d",
    measurementId: "G-0ZWGEY3JT3"
  }
};

// Firebase initialization is typically done in the Angular module, not in the environment file
