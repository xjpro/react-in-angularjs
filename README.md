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

## Caveats

### AngularJS within React

You can't use AngularJS within the React components so you'll need to work bottom up, i.e. replace low level
components first.

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