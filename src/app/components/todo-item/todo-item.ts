import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-item.html',
  styleUrls: ['./todo-item.scss'],
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() onDelete = new EventEmitter<number>();
  @Output() onUpdate = new EventEmitter<Todo>();

  isEditing = false;
  editTitle = '';
  editPriority: Todo['priority'] = 'medium';

  toggleStatus() {
    this.todo.completed = !this.todo.completed;
    this.onUpdate.emit(this.todo);
  }

  startEdit() {
    this.isEditing = true;
    this.editTitle = this.todo.title;
    this.editPriority = this.todo.priority;
  }

  saveEdit() {
    if (this.editTitle.trim()) {
      this.todo.title = this.editTitle;
      this.todo.priority = this.editPriority;
      this.isEditing = false;
      this.onUpdate.emit(this.todo);
    }
  }

  cancelEdit() {
    this.isEditing = false;
  }
}
