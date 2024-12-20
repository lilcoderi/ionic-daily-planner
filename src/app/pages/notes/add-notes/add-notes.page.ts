import { Component } from '@angular/core';
import { Firestore, collection, addDoc, Timestamp } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-add-notes',
  templateUrl: './add-notes.page.html',
  styleUrls: ['./add-notes.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class AddNotesPage {
  title: string = '';
  description: string = '';
  date: string = '';

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private router: Router
  ) {}

  async addNote() {
    const user = this.auth.currentUser;
    if (!user) return;

    const userId = user.uid;
    const notesCollection = collection(this.firestore, `notes/${userId}/userNotes`);

    const noteData = {
      title: this.title,
      description: this.description,
      date: Timestamp.fromDate(new Date(this.date)),
    };

    console.log("Adding note: ", noteData); // Log to check the note data

    await addDoc(notesCollection, noteData);
    this.router.navigate(['/home/notes']); // Navigate back to the notes page after saving
  }
}
