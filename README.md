# react-in-angularjs

A super simple way to render React components in AngularJS. This was written with the goal of
facilitating conversion of an AngularJS app without doing a full rewrite. 

## Install
The function contained in this library is small enough that you might just want to copy paste it. 
Feel free to do so. Otherwise:

`npm install react-in-angularjs`

`yarn add react-in-angularjs`

## Usage

```js
import React from "react";
import {angularize} from "react-in-angularjs";

export default class TodoList extends React.Component {
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

angularize(TodoList, angular.module("app"), {
  todos: "<"	
});

// You don't actually have to export anything to make this work but
// you'll likely want to export the class for testing and use in other components
```

TodoList React component now wrapped in an AngularJS component named "todoList". Sometime later in your app...

```html
<todo-list todos="{{todos}}"></todo-list>
```

## Services 

When you need to access an Angular service, you can access it with a separate function:

```js
// AngularJS code includes a service you'd like to use and can't rewrite yet:
window.angular.module("myApp").service("todoService", () => {
  // Some very lovingly crafted service code
});

import {getAngularService} from "react-in-angularjs"
const todoService = getAngularService("todoService");
// Now you've got the singleton instance of it
```

## Caveats

### AngularJS within React

You can't use AngularJS components within the React render so you'll need to work bottom up, i.e. 
replace low level components first. Low level components can be then be imported directly into
your React components as well as used in legacy AngularJS (assuming they are also angularized).

### Two Way Bindings

Two way bindings are not recommended, either by the AngularJS team or by me. However, it's not always possible to
remove them in a legacy application. In those cases, you will need to apply any changes like this:

```js
export class TodoItem {
  // imagine some React component with a change handler
  onChange = () => {
    this.props.$$scope.$apply(() => {
      // $$scope = AngularJS component scope, provided on a prop via react-in-angularjs
      this.props.twoWayBoundProperty = "new value"
    });
  };
}
```