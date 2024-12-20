import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsTodoPage } from './details-todo.page';

describe('DetailsTodoPage', () => {
  let component: DetailsTodoPage;
  let fixture: ComponentFixture<DetailsTodoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsTodoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
