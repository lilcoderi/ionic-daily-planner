import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';  // Import IonicModule
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router'; // Impor RouterOutlet
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,  // Make sure IonicModule is imported
    CommonModule,
    FormsModule,
    RouterOutlet
  ]
})
export class HomePage {
  constructor(private router: Router) {}

  navigateToAddPage() {
    const currentUrl = this.router.url;

    if (currentUrl.includes('/home/todo')) {
      this.router.navigate(['/add-todo']);
    } else if (currentUrl.includes('/home/notes')) {
      this.router.navigate(['/add-notes']);
    } else {
      console.log('No add page associated with the current tab.');
    }
  }
}
