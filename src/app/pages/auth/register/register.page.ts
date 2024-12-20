import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Tambahkan FormsModule
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';  // Import AuthService

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class RegisterPage {
  username: string = ''; // Define username
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  // Register method menggunakan AuthService
  register() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Memanggil metode register dari AuthService
    this.authService.register(this.email, this.password, this.username)
      .then((user) => {
        console.log('Registration successful', user);
        this.router.navigate(['/login']);  // Navigate to login page after registration
      })
      .catch((error) => {
        console.error('Error during registration:', error.message);
        alert('Registration failed: ' + error.message);
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
