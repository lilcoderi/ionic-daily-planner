import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditTodoPage } from './edit-todo.page';

describe('EditTodoPage', () => {
  let component: EditTodoPage;
  let fixture: ComponentFixture<EditTodoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTodoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
