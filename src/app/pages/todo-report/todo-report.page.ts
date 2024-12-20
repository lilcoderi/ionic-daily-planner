import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

Chart.register(PieController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-todo-report',
  templateUrl: './todo-report.page.html',
  styleUrls: ['./todo-report.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class TodoReportPage implements OnInit {
  completedCount = 0;
  notCompletedCount = 0;
  totalTodos = 0;
  chart: any;

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.loadTodoReport(user.uid);
      } else {
        console.error('User is not logged in.');
        this.router.navigate(['/login']);
      }
    });
  }

  loadTodoReport(userId: string) {
    const todosCollection = collection(this.firestore, `users/${userId}/todo`);
    collectionData(todosCollection, { idField: 'id' })
      .pipe(
        map((data: any[]) => {
          const completedTodos = data.filter((todo) => todo.completed);
          const notCompletedTodos = data.filter((todo) => !todo.completed);

          this.completedCount = completedTodos.length;
          this.notCompletedCount = notCompletedTodos.length;
          this.totalTodos = data.length;

          return {
            completed: this.completedCount,
            notCompleted: this.notCompletedCount,
          };
        })
      )
      .subscribe({
        next: (result) => {
          this.createPieChart(result.completed, result.notCompleted);
        },
        error: (error) => {
          console.error('Error loading todo data:', error);
        },
      });
  }

  createPieChart(completed: number, notCompleted: number) {
    if (this.chart) {
      this.chart.destroy(); // Hapus diagram lama
    }

    const canvas = document.getElementById('todoPieChart') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Completed', 'Not Completed'],
        datasets: [
          {
            data: [completed, notCompleted],
            backgroundColor: ['#36A2EB', '#FF6384'],
            hoverBackgroundColor: ['#36A2EB', '#FF6384'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }
}
