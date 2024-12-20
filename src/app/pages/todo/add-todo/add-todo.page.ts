import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc, Timestamp } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';  // Import ActivatedRoute
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import * as moment from 'moment-timezone';
@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.page.html',
  styleUrls: ['./add-todo.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ]
})
export class AddTodoPage implements OnInit {
  title = '';
  description = '';
  date: string = '';  // Initialize date as empty
  location = '';
  reminder = false;

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private router: Router,
    private activatedRoute: ActivatedRoute  // Inject ActivatedRoute to get route parameters
  ) {}

  ngOnInit() {
    // Memeriksa apakah ada parameter 'date' yang diterima
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['date']) {
        // Parse tanggal yang diterima dan pastikan zona waktunya adalah Asia/Jakarta
        const passedDate = new Date(params['date']);

        // Menggunakan moment untuk mengonversi waktu ke zona waktu Asia/Jakarta (WIB)
        const currentTimeInWIB = moment.tz('Asia/Jakarta'); // Zona waktu Indonesia (WIB)

        // Setel jam, menit, dan detik dari passedDate sesuai dengan waktu di WIB
        passedDate.setHours(currentTimeInWIB.hours());
        passedDate.setMinutes(currentTimeInWIB.minutes());
        passedDate.setSeconds(currentTimeInWIB.seconds());

        // Menyimpan tanggal yang sudah disesuaikan ke dalam variabel 'date'
        this.date = passedDate.toISOString();  // Simpan sebagai string dalam format ISO
      }
    });



    // Request permission for notifications if necessary
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        } else {
          console.log('Notification permission denied.');
        }
      });
    }
  }



  async addTodo() {
    const user = this.auth.currentUser;
    if (!user) {
      console.error('No user is currently logged in.');
      return;
    }

    const todoData = {
      title: this.title,
      description: this.description,
      date: Timestamp.fromDate(new Date(this.date)),
      location: this.location,
      reminder: this.reminder
    };

    try {
      const userTodosCollection = collection(this.firestore, `users/${user.uid}/todo`);
      await addDoc(userTodosCollection, todoData);
      console.log('Todo successfully added to Firestore');

      if (this.reminder) {
        const todoDate = new Date(this.date);
        await this.scheduleNotification(todoDate, this.title);
      }

      this.router.navigate(['/home/todo']);
    } catch (error) {
      console.error('Error adding todo to Firestore:', error);
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
