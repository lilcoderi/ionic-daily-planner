import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, query } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class NotesPage implements OnInit {
  notes: any[] = [];

  constructor(
    private router: Router,
    private firestore: Firestore,
    private auth: Auth
  ) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('Authenticated user:', user);
        this.fetchNotes(user.uid);
      } else {
        console.log('User not authenticated, redirecting to login.');
        this.router.navigate(['/login']);
      }
    });
  }

  fetchNotes(userId: string) {
    const notesCollection = collection(this.firestore, `notes/${userId}/userNotes`);
    const notesQuery = query(notesCollection);

    collectionData(notesQuery, { idField: 'id' }).subscribe(data => {
      console.log('Fetched notes:', data);
      this.notes = data.map(note => ({
        ...note,
        date: note['date'] ? note['date'].toDate() : null
      }));
      console.log('Processed notes:', this.notes);
    });
  }

  goToAddNotes() {
    this.router.navigate(['/add-notes']);
  }
  goToNoteDetails(noteId: string) {
    console.log('Navigating to note-details with ID:', noteId);
    this.router.navigate(['/note-details', noteId]);
  }
  goToEditNote(noteId: string, event: Event) {
    event.stopPropagation(); // Mencegah event bubbling sehingga tidak menjalankan goToNoteDetails
    this.router.navigate(['/edit-notes', noteId]);
  }


}
