# react-in-angularjs

A super simple way to render React components in AngularJS.

## Install
`npm install react-in-angularjs`

`yarn add react-in-angularjs`

## Usage

```js
import React from "react";
import angularize from "react-in-angularjs";

export class TodoList extends React.PureComponent {
  render() {
    const {todos} = this.props;
    return (
      <ol>
      {todos.map(todo => (
        <li>{todo.description}</li>
      ))}
      </ol>
    );
  }
}

export default angularize(TodoList, angular.module("app"), {
  todos: "<"	
});
```

TodoList React component now wrapped in an AngularJS component named "todoList". Sometime later in your app...

```html
<todo-list todos="{{todos}}"></todo-list>
```