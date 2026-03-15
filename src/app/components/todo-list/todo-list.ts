import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import { TodoFormComponent } from '../todo-form/todo-form';
import { TodoItemComponent } from '../todo-item/todo-item';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoFormComponent, TodoItemComponent],
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.scss'],
})
export class TodoListComponent implements OnInit {
  private todoService = inject(TodoService);
  todos: Todo[] = [];
  filter: 'all' | 'active' | 'completed' = 'all';
  sortBy: 'priority' | 'added' = 'priority';

  loadTodos() {
    this.todoService.getTodos().subscribe({
      next: (res) => {
        this.todos = res.map((t) => ({ ...t, priority: 'medium' }));
        this.filter = 'all';
        this.sortBy = 'priority';
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  ngOnInit() {
    this.loadTodos();
  }

  setFilter(value: 'all' | 'active' | 'completed') {
    this.filter = value;

    if (this.todos.length === 0) {
      this.loadTodos();
    }
  }

  addTodo(data: { title: string; priority: Todo['priority'] }) {
    const newTodo: Partial<Todo> = {
      title: data.title,
      completed: false,
      priority: data.priority,
    };

    const localTodo: Todo = {
      id: Date.now(),
      title: newTodo.title!,
      completed: false,
      priority: newTodo.priority!,
    };

    this.todos.unshift(localTodo);
    this.filter = 'all';

    this.todoService.addTodo(newTodo).subscribe({
      next: (todo) => {
        const idx = this.todos.findIndex((t) => t.id === localTodo.id);
        if (idx > -1) {
          this.todos[idx] = {
            id: todo.id || localTodo.id,
            title: todo.title || localTodo.title,
            completed: todo.completed ?? localTodo.completed,
            priority: (todo as Todo).priority ?? localTodo.priority,
          } as Todo;
        }
      },
      error: (err) => console.error('Can not add todo', err),
    });
  }

  deleteTodo(id: number) {
    const idExist = this.todos.some((t) => t.id === id);

    if (!idExist) return;

    this.todos = this.todos.filter((t) => t.id !== id);

    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        console.log('Deleted todo', id);
      },
      error: (err) => console.error('Can not delete todo', err),
    });
  }

  updateTodo(todo: Todo) {
    const idx = this.todos.findIndex((t) => t.id === todo.id);
    if (idx > -1) {
      this.todos[idx] = { ...todo };
    }

    if (todo.id <= 200) {
      this.todoService.updateTodo(todo).subscribe({
        next: (updated) => console.log('Sucsessfully updated', updated),
        error: (err) => console.error('Error updating todo', err),
      });
    } else {
      console.log('Local update', todo);
    }
  }

  get filteredTodos() {
    const filter = this.filter || 'all';
    const sortBy = this.sortBy || 'priority';

    let list = this.todos;
    if (filter === 'active') list = this.todos.filter((t) => !t.completed);
    if (filter === 'completed') list = this.todos.filter((t) => t.completed);

    if (sortBy === 'added') {
      return [...list];
    }

    const weight = { high: 1, medium: 2, low: 3 };
    return [...list].sort((a, b) => weight[a.priority] - weight[b.priority]);
  }
}
