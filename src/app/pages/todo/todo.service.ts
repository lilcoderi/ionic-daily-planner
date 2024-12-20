import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  calendarEvents: any[] = [];

  addToCalendarEvents(event: { title: string; date: string }) {
    // Pastikan hanya menambahkan event yang belum selesai
    this.calendarEvents.push(event);
  }

  getCalendarEvents() {
    // Hanya tampilkan event yang belum selesai
    return this.calendarEvents.filter(event => !event.completed);
  }

  removeEvent(title: string) {
    this.calendarEvents = this.calendarEvents.filter(event => event.title !== title);
  }
}
