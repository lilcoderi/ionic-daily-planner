import { Injectable, Injector } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { getAuth, User, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private auth = getAuth();
  constructor(private firestore: AngularFirestore) {}

  // Mendapatkan catatan berdasarkan userId yang diteruskan dari NotesPage
  getNotesForUser(userId: string): Observable<Note[]> {
    return this.firestore.collection<Note>(`users/${userId}/notes`).valueChanges({ idField: 'id' });
  }

  // Menambahkan catatan untuk user tertentu
  addNoteToUser(userId: string, noteData: Partial<Note>): Promise<void> {
    const noteId = this.firestore.createId();
    return this.firestore.doc(`users/${userId}/notes/${noteId}`).set(noteData);
  }

  // Menghapus catatan berdasarkan userId dan noteId
  deleteNoteForUser(userId: string, noteId: string): Promise<void> {
    return this.firestore.doc(`users/${userId}/notes/${noteId}`).delete();
  }
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}

// Deklarasi interface Note
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
