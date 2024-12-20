import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-edit-notes',
  templateUrl: './edit-notes.page.html',
  styleUrls: ['./edit-notes.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class EditNotesPage implements OnInit {
  noteId: string = '';
  title: string = '';
  description: string = '';
  date: string = '';  // Stores date in 'YYYY-MM-DD' format
  time: string = '';  // Stores time in 'HH:mm' format

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore,
    private auth: Auth
  ) {}

  ngOnInit() {
    this.noteId = this.route.snapshot.paramMap.get('id') || '';
    this.loadNoteData();
  }

  async loadNoteData() {
    const user = this.auth.currentUser;
    if (!user) return;

    const noteDocRef = doc(this.firestore, `notes/${user.uid}/userNotes/${this.noteId}`);
    const noteSnap = await getDoc(noteDocRef);
    if (noteSnap.exists()) {
      const noteData = noteSnap.data();
      this.title = noteData['title'];
      this.description = noteData['description'];

      if (noteData['date'] && noteData['date'].toDate) {
        const fullDate = noteData['date'].toDate();
        this.date = fullDate.toISOString().split('T')[0];  // Extract date
        this.time = fullDate.toTimeString().split(' ')[0].slice(0, 5);  // Extract time (HH:mm)
      }
    }
  }

  async saveNote() {
    const user = this.auth.currentUser;
    if (!user) return;

    // Combine date and time into a single Date object
    const [year, month, day] = this.date.split('-').map(Number);
    const [hours, minutes] = this.time.split(':').map(Number);
    const combinedDate = new Date(year, month - 1, day, hours, minutes);

    const noteDocRef = doc(this.firestore, `notes/${user.uid}/userNotes/${this.noteId}`);
    await updateDoc(noteDocRef, {
      title: this.title,
      description: this.description,
      date: combinedDate
    });

    this.router.navigate(['/home/notes']);
  }
}
