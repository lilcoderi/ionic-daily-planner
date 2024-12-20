import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router'; // Import Router
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FullCalendarModule } from '@fullcalendar/angular';
import { map } from 'rxjs/operators';
import * as moment from 'moment-timezone';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FullCalendarModule,
  ]
})
export class CalendarPage implements OnInit, AfterViewInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    events: [],  // Start with an empty array
    height: 'auto',
    eventContent: function (info) {
      let title = info.event.title;
      // Limit the title to 5 characters
      if (title.length > 5) {
        title = title.slice(0, 5) + '...';  // Truncate to 5 characters
      }
      return { html: title };  // Display only the title
    },
    eventClassNames: ['custom-event'], // Optional: Add a custom class for styling
    eventDidMount: function (info) {
      const eventElement = info.el;
      const eventsOnSameDay = info.view.calendar.getEvents().filter((e: any) => e.startStr === info.event.startStr);
      if (eventsOnSameDay.length > 1) {
        eventElement.style.top = `${eventsOnSameDay.indexOf(info.event) * 25}px`;  // Adjust position if overlapping
      }
    },
    dateClick: (info) => { // Handle date click
      this.navigateToAddTodo(info.dateStr);  // Call method to navigate and pass date
    }
  };

  @ViewChild(FullCalendarComponent) calendarComponent: FullCalendarComponent | undefined;

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private router: Router // Inject Router for navigation
  ) {}

  ngOnInit() {
    // Ensure user is authenticated before loading data
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('Authenticated user:', user);
        this.loadCalendarEvents(user.uid);
      } else {
        console.log('User not authenticated');
      }
    });
  }

  ngAfterViewInit() {
    // This will ensure the calendar is initialized and ready
    if (this.calendarComponent) {
      this.calendarComponent.getApi().render();  // Force render if necessary
    }
  }

  loadCalendarEvents(userId: string) {
    const todosCollection = collection(this.firestore, `users/${userId}/todo`);
    collectionData(todosCollection, { idField: 'id' })
      .pipe(
        map((data) => {
          console.log("Data fetched from Firestore:", data);  // Log data fetched
          return data
            .filter(todo => !todo['completed'])  // Filter only incomplete todos
            .map(todo => ({
              title: todo['title'],
              date: todo['date'], // Ensure this is a valid Firestore timestamp
            }));
        })
      )
      .subscribe((events) => {
        console.log("Filtered events for calendar:", events);  // Log events after filtering
        // Ensure date is in valid format
        const formattedEvents = events.map(event => ({
          title: event.title,
          start: new Date(event.date.seconds * 1000), // Convert Firestore Timestamp to Date
        }));

        // Update calendar options with events
        this.calendarOptions.events = formattedEvents;

        // After updating, refresh the calendar
        if (this.calendarComponent) {
          this.calendarComponent.getApi().refetchEvents();  // Force the calendar to re-render
        }
      }, error => {
        console.error("Error fetching events:", error);
      });
  }

  handleDateClick(date: any) {
    const selectedDate = new Date(date.dateStr);  // Dapatkan tanggal yang dipilih

    // Menggunakan moment untuk mengonversi waktu ke zona waktu Asia/Jakarta (WIB)
    const currentTimeInWIB = moment.tz('Asia/Jakarta'); // Zona waktu Indonesia (WIB)

    // Setel jam, menit, dan detik sesuai dengan waktu saat ini di WIB
    selectedDate.setHours(currentTimeInWIB.hours());
    selectedDate.setMinutes(currentTimeInWIB.minutes());
    selectedDate.setSeconds(currentTimeInWIB.seconds());

    // Kirim tanggal yang sudah disesuaikan ke halaman AddTodoPage menggunakan queryParams
    this.router.navigate(['/add-todo'], { queryParams: { date: selectedDate.toISOString() } });
  }




  // Method to navigate to add-todo page with the selected date
  navigateToAddTodo(date: string) {
    this.router.navigate(['/add-todo'], {
      queryParams: {
        date: date // Pass the selected date to the next page
      }
    });
  }
}
