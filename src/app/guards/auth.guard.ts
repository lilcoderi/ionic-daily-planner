import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      // Jika sudah login, izinkan akses ke halaman
      return true;
    } else {
      // Jika belum login, arahkan ke halaman login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
