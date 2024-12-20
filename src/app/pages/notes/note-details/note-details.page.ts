import { Component, OnInit } from '@angular/core';
import { Firestore, doc, getDoc, deleteDoc } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.page.html',
  styleUrls: ['./note-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class NoteDetailsPage implements OnInit {
  noteId: string = ''; // Variabel untuk menyimpan ID note
  note: any = null; // Variabel untuk menyimpan data note

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private router: Router,
    private auth: Auth,
    private alertController: AlertController // Tambahkan AlertController untuk dialog konfirmasi
  ) {}

  async ngOnInit() {
    this.noteId = this.route.snapshot.paramMap.get('id') || ''; // Ambil ID dari URL
    if (this.noteId) {
      await this.loadNoteDetails(this.noteId); // Muat detail note berdasarkan ID
    } else {
      console.log('No note ID found in route.');
    }
  }

  // Fungsi untuk mengambil detail note berdasarkan noteId
  async loadNoteDetails(noteId: string) {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const userId = user.uid;
      const noteDoc = doc(this.firestore, `notes/${userId}/userNotes/${noteId}`);
      const noteSnap = await getDoc(noteDoc);

      if (noteSnap.exists()) {
        this.note = noteSnap.data();
        console.log('Fetched note details:', this.note);
      } else {
        console.log('Note not found');
      }
    } catch (error) {
      console.error('Error fetching note details:', error);
    }
  }

  // Fungsi untuk menampilkan dialog konfirmasi sebelum menghapus note
  async confirmDeleteNote() {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this note?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Delete canceled');
          },
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await this.deleteNote(); // Panggil fungsi deleteNote
          },
        },
      ],
    });

    await alert.present();
  }

  // Fungsi untuk menghapus note
  async deleteNote() {
    try {
      const user = this.auth.currentUser;
      if (!user || !this.note) return;

      const noteDocRef = doc(this.firestore, `notes/${user.uid}/userNotes/${this.noteId}`);
      await deleteDoc(noteDocRef); // Hapus note dari Firestore

      console.log('Note deleted successfully');
      this.router.navigate(['/home/notes']); // Redirect ke halaman notes setelah dihapus
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }
}
