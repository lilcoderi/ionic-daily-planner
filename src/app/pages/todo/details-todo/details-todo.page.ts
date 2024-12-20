import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, getDoc, deleteDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-details-todo',
  templateUrl: './details-todo.page.html',
  styleUrls: ['./details-todo.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ]
})
export class DetailsTodoPage implements OnInit {
  todo: any;
  todoId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private auth: Auth,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.todoId = this.route.snapshot.paramMap.get('id');
    const user = this.auth.currentUser;
    if (user && this.todoId) {
      this.fetchTodoDetails(user.uid, this.todoId);
    }
  }

  async fetchTodoDetails(userId: string, todoId: string) {
    const todoDoc = doc(this.firestore, `users/${userId}/todo/${todoId}`);
    const docSnap = await getDoc(todoDoc);

    if (docSnap.exists()) {
      this.todo = docSnap.data();
    } else {
      console.log('Todo not found');
    }
  }

  goToEditTodo() {
    this.router.navigate(['/edit-todo', this.todoId]);
  }

  async deleteTodo() {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this todo?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: async () => {
            const user = this.auth.currentUser;
            if (user && this.todoId) {
              const todoDoc = doc(this.firestore, `users/${user.uid}/todo/${this.todoId}`);
              await deleteDoc(todoDoc);
              this.router.navigate(['/home/todo']);  // Redirect back to the todo list
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
