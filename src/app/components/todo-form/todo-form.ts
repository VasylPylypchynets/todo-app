import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-form.html',
  styleUrls: ['./todo-form.scss'],
})
export class TodoFormComponent {
  @Output() onAdd = new EventEmitter<Pick<Todo, 'title' | 'priority'>>();

  title: string = '';
  priority: Todo['priority'] = 'medium';

  onSubmit() {
    if (this.title.trim()) {
      this.onAdd.emit({ title: this.title.trim(), priority: this.priority });
      this.title = '';
      this.priority = 'medium';
    }
  }
}
