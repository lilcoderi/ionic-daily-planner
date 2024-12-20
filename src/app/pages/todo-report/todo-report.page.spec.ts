import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoReportPage } from './todo-report.page';

describe('TodoReportPage', () => {
  let component: TodoReportPage;
  let fixture: ComponentFixture<TodoReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
