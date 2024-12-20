import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, query, doc, updateDoc } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { TodoService } from './todo.service'; // Layanan untuk berbagi data ke calendar
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // Import IonicModule

@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ],
})
export class TodoPage implements OnInit {
  todo: any[] = []; // Semua todo
  filteredTodos: any[] = []; // Todo yang difilter berdasarkan tanggal
  filterDate: string = ''; // Default kosong (tidak ada tanggal yang dipilih)

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private router: Router,
    private todoService: TodoService // Inject layanan
  ) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.fetchTodos(user.uid);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  // Mengambil semua todo
  fetchTodos(userId: string) {
    const todosCollection = collection(this.firestore, `users/${userId}/todo`);
    const todosQuery = query(todosCollection);

    collectionData(todosQuery, { idField: 'id' }).subscribe(
      (data) => {
        this.todo = data;
        this.updateFilteredTodos();
      },
      (error) => console.error('Error fetching todos:', error)
    );
  }

  // Filter todo berdasarkan tanggal atau tampilkan semua jika tanggal kosong
  filterTodos() {
    if (!this.filterDate) {
      // Jika tanggal tidak dipilih, tampilkan semua todo
      this.filteredTodos = [...this.todo];
      return;
    }

    const selectedDate = new Date(this.filterDate).toISOString().split('T')[0];

    this.filteredTodos = this.todo.filter((item) => {
      let todoDate: string;

      if (item.date instanceof Date) {
        todoDate = item.date.toISOString().split('T')[0];
      } else if (item.date && typeof item.date === 'object' && 'toDate' in item.date) {
        todoDate = item.date.toDate().toISOString().split('T')[0];
      } else if (typeof item.date === 'string') {
        todoDate = item.date.split('T')[0];
      } else {
        console.warn(`Unrecognized date format for todo:`, item);
        return false;
      }

      return todoDate === selectedDate;
    });
  }

  // Perbarui hasil filter berdasarkan input tanggal
  updateFilteredTodos() {
    this.filterTodos();
  }

  toggleFilterDate(event: Event) {
    const input = event.target as HTMLInputElement;
    const selectedDate = input.value.trim(); // Ambil nilai tanggal dari input

    console.log('Selected date:', selectedDate);
    console.log('Current filterDate:', this.filterDate);

    // Normalisasi format tanggal untuk perbandingan
    const normalizedSelectedDate = selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : '';
    const normalizedFilterDate = this.filterDate ? new Date(this.filterDate).toISOString().split('T')[0] : '';

    if (normalizedFilterDate === normalizedSelectedDate) {
      console.log('Removing filter');
      this.filterDate = '';
      input.value = ''; // Reset nilai input dengan eksplisit
    } else {
      console.log('Setting new filter date');
      this.filterDate = selectedDate;
    }

    this.updateFilteredTodos();
  }





  // Navigasi ke halaman tambah todo
  goToAddTodo() {
    this.router.navigate(['/add-todo']);
  }

  // Tandai todo sebagai selesai
  async markAsDone(todo: any, event: Event) {
    event.stopPropagation();
    const user = this.auth.currentUser;
    if (!user) return;

    try {
      const todoDoc = doc(this.firestore, `users/${user.uid}/todo/${todo.id}`);
      await updateDoc(todoDoc, { completed: todo.completed });

      if (todo.completed) {
        await this.todoService.addToCalendarEvents({
          title: todo.title,
          date: todo.date,
        });
      }
    } catch (error) {
      console.error('Error saat memperbarui todo:', error);
    }
  }

  // Navigasi ke detail todo
  goToTodoDetails(todoId: string, event: Event) {
    if (event.target instanceof HTMLElement && event.target.tagName === 'ION-TOGGLE') {
      return;
    }
    this.router.navigate(['/details-todo', todoId]);
  }

  // Navigasi ke laporan todo
  goToTodoReport() {
    this.router.navigate(['/todo-report']);
  }
}
