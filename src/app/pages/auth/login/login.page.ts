import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';  // Import AuthService
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: true,
  imports: [
    IonicModule,  // Make sure IonicModule is imported
    CommonModule,
    FormsModule
  ]
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Login method
  login() {
    this.authService.login(this.email, this.password)
      .then((userCredential) => {
        console.log('Login successful:', userCredential.user);
        this.router.navigate(['/home']); // Redirect to home page after login
      })
      .catch((error) => {
        console.error('Error during login:', error.message);
        alert('Login failed: ' + error.message);
      });
  }

  // Navigate to the registration page
  goToRegister() {
    this.router.navigate(['/register']);
  }
}
