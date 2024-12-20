import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarPage } from './pages/calendar/calendar.page';
import { TodoPage } from './pages/todo/todo.page';
import { NotesPage } from './pages/notes/notes.page';
import { AccountPage } from './pages/account/account.page';
import { HomePage } from './pages/home/home.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home/todo', // Mengarahkan ke /home/calendar secara default
    pathMatch: 'full',
  },

  {
    path: 'home',
    component: HomePage,
    children: [
      {
        path: 'calendar',
        component: CalendarPage,
      },
      {
        path: 'todo',
        component: TodoPage,
      },
      {
        path: 'notes',
        component: NotesPage,
      },
      {
        path: 'account',
        component: AccountPage,
      },

    ]
  },
  // Ensure login, register, etc., are defined as separate routes
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'edit-profile',
    loadComponent: () => import('./pages/account/edit-profile/edit-profile.page').then( m => m.EditProfilePage)
  },
  {
    path: 'add-notes',
    loadComponent: () => import('./pages/notes/add-notes/add-notes.page').then( m => m.AddNotesPage)
  },
  {
    path: 'note-details/:id',
    loadComponent: () => import('./pages/notes/note-details/note-details.page').then(m => m.NoteDetailsPage)
  },
  {
    path: 'edit-notes/:id',
    loadComponent: () => import('./pages/notes/edit-notes/edit-notes.page').then( m => m.EditNotesPage)
  },
  {
    path: 'add-todo',
    loadComponent: () => import('./pages/todo/add-todo/add-todo.page').then( m => m.AddTodoPage)
  },
  {
    path: 'details-todo/:id',
    loadComponent: () => import('./pages/todo/details-todo/details-todo.page').then( m => m.DetailsTodoPage)
  },
  {
    path: 'edit-todo/:id',
    loadComponent: () => import('./pages/todo/edit-todo/edit-todo.page').then( m => m.EditTodoPage)
  },
  {
    path: 'todo-report',
    loadComponent: () => import('./pages/todo-report/todo-report.page').then( m => m.TodoReportPage)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
