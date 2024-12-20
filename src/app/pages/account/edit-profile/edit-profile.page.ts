import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { getAuth } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: 'edit-profile.page.html',
  styleUrls: ['edit-profile.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class EditProfilePage implements OnInit {
  username: string = '';
  email: string = '';

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

  ngOnInit() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      // Ambil data pengguna dari Firestore berdasarkan user.uid
      this.userService.getUserDataFromFirestore(user.uid).then((userDoc) => {
        if (userDoc && userDoc.exists()) {
          const data = userDoc.data();
          this.username = data['username'] || ''; // Ambil username dari Firestore
          this.email = user.email || ''; // Ambil email dari Firebase Authentication
        } else {
          console.error('Data pengguna tidak ditemukan di Firestore');
        }
      }).catch((error) => {
        console.error('Error fetching user data from Firestore:', error);
      });
    }
  }

  saveProfile() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      // Perbarui data pengguna (username dan email) di Firestore
      this.userService.updateUserData(user.uid, {
        username: this.username,
        email: this.email,
      }).then(() => {
        console.log('Profile updated');
        this.router.navigate(['/account']);
      }).catch((error) => {
        console.error('Error updating profile:', error);
      });
    }
  }
}
