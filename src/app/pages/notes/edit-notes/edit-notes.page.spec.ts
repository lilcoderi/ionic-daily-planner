import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditNotesPage } from './edit-notes.page';

describe('EditNotesPage', () => {
  let component: EditNotesPage;
  let fixture: ComponentFixture<EditNotesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNotesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
