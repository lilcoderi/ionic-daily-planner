import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

interface UserData {
  username: string;
  email: string;
}

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AccountPage implements OnInit {
  userData: UserData = {
    username: 'No Username', // Default value
    email: '',
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private alertController: AlertController // Tambahkan AlertController
  ) {}

  ngOnInit() {
    this.authService.getUserState().subscribe({
      next: (user) => {
        if (user) {
          this.userService
            .getUserDataFromFirestore(user.uid)
            .then((userDoc) => {
              if (userDoc.exists()) {
                const data = userDoc.data();
                this.userData.username = data['username'] || 'No Username';
                this.userData.email = data['email'] || user.email || '';
              } else {
                console.error('User data not found in Firestore');
              }
            })
            .catch((error) => {
              console.error('Error fetching user data from Firestore:', error);
            });
        }
      },
      error: (error) => {
        console.error('Error in user state subscription:', error);
      },
    });
  }

  goToEditProfile() {
    this.router.navigate(['/edit-profile']);
  }

  // Fungsi logout asli
  logout() {
    this.authService
      .logout()
      .then(() => {
        console.log('Logout berhasil');
        this.router.navigate(['/login']); // Arahkan ke halaman login
      })
      .catch((error) => {
        console.error('Error saat logout:', error);
      });
  }

  // Fungsi konfirmasi logout
  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Logout',
          role: 'destructive',
          handler: () => {
            this.logout(); // Panggil fungsi logout
          },
        },
      ],
    });

    await alert.present();
  }
}
