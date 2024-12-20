import { Injectable } from '@angular/core';
import { getAuth, User, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { Observable } from 'rxjs';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth();
  private db = getFirestore();

  constructor() {}

  login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  register(email: string, password: string, username: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        await setDoc(doc(this.db, 'users', user.uid), {
          uid: user.uid,
          email: email,
          username: username,
        });

        return user;
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  }

  getUserState(): Observable<any> {
    return new Observable((observer) => {
      onAuthStateChanged(this.auth, (user) => {
        observer.next(user);
      });
    });
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  logout(): Promise<void> {
    return this.auth.signOut();
  }
}
