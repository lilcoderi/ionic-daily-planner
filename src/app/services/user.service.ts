import { Injectable, Injector } from '@angular/core';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private db = getFirestore();
  private authService!: AuthService; // Lazy injected AuthService

  constructor(private injector: Injector) {}

  private getAuthService(): AuthService {
    if (!this.authService) {
      this.authService = this.injector.get(AuthService);
    }
    return this.authService;
  }

  saveUserData(userId: string, data: { email: string; username: string }): Promise<void> {
    return setDoc(doc(this.db, 'users', userId), data);
  }

  getUserData(userId: string) {
    return getDoc(doc(this.db, 'users', userId));
  }

  updateUserData(userId: string, data: { email?: string; username?: string }) {
    return setDoc(doc(this.db, 'users', userId), data, { merge: true });
  }

  getUserDataFromFirestore(userId: string) {
    return getDoc(doc(this.db, 'users', userId));
  }
}
