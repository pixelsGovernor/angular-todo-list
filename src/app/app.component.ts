import { Component } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Todo } from '../Models/todo.module';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  groups: String[] = [];
  todos: Todo[] = [];
  todosByGroup: { [group: string]: Todo[] } = {};

  constructor() {
    let info = {
      groups: [],
      todos: [],
      todosByGroup: {}
    };
    if (localStorage.getItem('todoList')) {
      info = JSON.parse(localStorage.getItem('todoList'));
    }
    this.groups = info.groups;
    this.todos = info.todos;
    this.todosByGroup = info.todosByGroup;
    /*
    this.groups.forEach((group: string) => {
      const itemsGroup = this.todos.filter((item) => item.group === group);
      if (itemsGroup.length === 0) {
        this.groups = this.groups.filter(groupSaved => groupSaved !== group);
      } else {
        this.todosByGroup[group] = itemsGroup;
      }
    });
    const itemsWithoutGroup = this.todos.filter((item) => !item.group || !item.group.length);
    if (itemsWithoutGroup.length > 0) {
      this.groups.push('none');
      this.todosByGroup.none = itemsWithoutGroup;
    }*/
  }

  onSubmit(form: NgForm) {
    const { group, title, description, link } = form.value;
    const todo = new Todo(Guid.create(), group, title, description, link, false);
    if (group && group.length) {
      if (!this.groups.includes(group)) { this.groups.push(group); }
      this.todosByGroup[group] = [todo];
    } else {
      if (!this.todosByGroup.none) { this.todosByGroup.none = [todo]; } else { this.todosByGroup.none.push(todo); }
    }
    this.todos.push(todo);
    form.resetForm();
    this.onSaveData();
  }

  onComplete(id: Guid, group: string) {
    const todoCompleted = this.todos.filter(todo => todo.id === id)[0];
    todoCompleted.isComplete = true;
    const groupSaved = group && group.length ? group : 'none';
    this.todosByGroup[groupSaved] = this.todosByGroup[groupSaved].map((item) => {
      if (item.id === id) { return { ...item, isComplete: true}; }
      return item;
    });
    this.onSaveData();
  }

  onRestore(id: Guid) {
    const todoRestored = this.todos.filter(todo => todo.id === id)[0];
    todoRestored.isComplete = false;
    this.onSaveData();
  }

  onDelete(id: Guid, group: string) {
    if (group) {
      const itemsWithThatGroup = this.todos.filter(todo => todo.group === group).length;
      if (itemsWithThatGroup === 1) {
        this.groups = this.groups.filter(groupSaved => groupSaved !== group);
        delete this.todosByGroup[group];
      } else {
        this.todosByGroup[group] = this.todosByGroup[group].filter(item => item.id !== id);
      }
    } else {
      if (this.todosByGroup.none.length === 1) {
        delete this.todosByGroup.none;
      } else {
        this.todosByGroup.none = this.todosByGroup.none.filter(item => item.id !== id);
      }
    }
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.onSaveData();
  }

  onSaveData() {
    localStorage.setItem('todoList', JSON.stringify({groups: this.groups, todos: this.todos, todosByGroup: this.todosByGroup}));
  }

  onDownload() {
    // navigator.clipboard.writeText(JSON.stringify(this.todos));
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(localStorage.getItem('todoList'))));
    element.setAttribute('download', 'todoList');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}
