import { Component, OnInit } from '@angular/core';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-edit-todo',
  templateUrl: './edit-todo.page.html',
  styleUrls: ['./edit-todo.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ]
})
export class EditTodoPage implements OnInit {
  title = '';
  description = '';
  date: string = ''; // Tanggal dalam format 'YYYY-MM-DD'
  time: string = ''; // Waktu dalam format 'HH:mm'
  location = '';
  reminder = false;
  todoId: string | null = null;

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.todoId = this.route.snapshot.paramMap.get('id');
    const user = this.auth.currentUser;
    if (user && this.todoId) {
      this.fetchTodoDetails(user.uid, this.todoId);
    }

    // Request permission for notifications
    this.requestNotificationPermission();
  }

  async requestNotificationPermission() {
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display !== 'granted') {
      console.warn('Notification permission not granted');
    }
  }

  async fetchTodoDetails(userId: string, todoId: string) {
    const todoDoc = doc(this.firestore, `users/${userId}/todo/${todoId}`);
    const docSnap = await getDoc(todoDoc);

    if (docSnap.exists()) {
      const todoData = docSnap.data();
      this.title = todoData?.['title'] || '';
      this.description = todoData?.['description'] || '';
      this.location = todoData?.['location'] || '';
      this.reminder = todoData?.['reminder'] || false;

      // Handle the 'date' field
      if (todoData?.['date']) {
        let fullDate;

        if (todoData['date'].toDate) {
          fullDate = todoData['date'].toDate();
        } else if (typeof todoData['date'] === 'string') {
          fullDate = new Date(todoData['date']);
        } else {
          console.warn('Date field is not a valid format');
          fullDate = null;
        }

        if (fullDate) {
          this.date = fullDate.toISOString().split('T')[0]; // Format 'YYYY-MM-DD'
          this.time = fullDate.toTimeString().slice(0, 5); // Format 'HH:mm'
        } else {
          this.date = '';
          this.time = '';
        }
      } else {
        console.warn('Date field is missing');
        this.date = '';
        this.time = '';
      }
    } else {
      console.error('Todo not found');
    }
  }

  async updateTodo() {
    const user = this.auth.currentUser;
    if (!user || !this.todoId) return;

    // Kombinasikan tanggal dan waktu menjadi satu objek Date
    const combinedDate = this.date && this.time
      ? new Date(`${this.date}T${this.time}:00`)
      : null;

    const updatedTodo = {
      title: this.title,
      description: this.description,
      date: combinedDate,
      location: this.location,
      reminder: this.reminder
    };

    try {
      const todoDoc = doc(this.firestore, `users/${user.uid}/todo/${this.todoId}`);
      await updateDoc(todoDoc, updatedTodo);

      console.log('Todo successfully updated');

      // Jadwalkan notifikasi jika reminder diaktifkan
      if (this.reminder && combinedDate) {
        await this.scheduleNotification(combinedDate, this.title);
      }

      this.router.navigate(['/home/todo']);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }

  async scheduleNotification(todoDate: Date, title: string) {
    const isBrowser = !Capacitor.isNativePlatform();

    if (isBrowser) {
      if (Notification.permission === 'granted') {
        const delay = todoDate.getTime() - new Date().getTime();
        if (delay > 0) {
          setTimeout(() => {
            new Notification('Todo Reminder', {
              body: `Reminder: ${title}`,
              icon: '/assets/icon/icon.png',
            });
          }, delay);
          console.log('Notification scheduled in browser:', title, todoDate);
        } else {
          console.error('Reminder date is in the past. No notification scheduled.');
        }
      }
      return;
    }

    if (Capacitor.isNativePlatform() && todoDate.getTime() > new Date().getTime()) {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: new Date().getTime(),
            title: 'Todo Reminder',
            body: `Reminder: ${title}`,
            schedule: { at: todoDate },
            smallIcon: 'ic_notification',
            actionTypeId: '',
            extra: null,
          },
        ],
      });
      console.log('Notification scheduled:', title, todoDate);
    } else {
      console.error('Reminder date is in the past. No notification scheduled.');
    }
  }
}
