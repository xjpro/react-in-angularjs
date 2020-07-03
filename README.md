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

// Note: This also works with class components
const TodoList = ({todos}) =>  {
  return (
    <ol>
      {todos.map(todo => (
        <li key={todo._id}>
          {todo.description}
        </li>
      ))}
    </ol>
  );
};

angularize(TodoList, "todoList", angular.module("app"), {
  todos: "<"	
});

// You don't actually have to export anything to make this work but
// you'll likely want to for tests and use in other components
export default TodoList;
```

TodoList React component now wrapped in an AngularJS component named "todoList". Sometime later in your app...

```html
<todo-list todos="todos"></todo-list>
```

## Building

Since you likely don't have a normal React entry point, you'll need to leverage webpack's 
ability to have multiple entry points. I accomplish this in my own project using `glob`:

```js
const glob = require("glob");
const path = require("path");

module.exports = {
  devtool: "source-map",
  entry: glob.sync("./src/**/!(*.test).jsx"),
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist") 
  }
};
```

## Services 

When you need to access an Angular service, you can access it with a separate function:

```js
// AngularJS code includes a service you'd like to use and can't rewrite yet:
window.angular.module("myApp").service("todoService", () => {
  // Some very lovingly crafted service code
});

import {getService} from "react-in-angularjs"
const todoService = getService("todoService");
// Now you've got the singleton instance of it
```

This can also be used to fetch built-in AngularJS services like $timeout, $http, etc.

## Directives

Sometimes you really need the resulting component to be a directive, typically
when doing tables. For those situations, do this:

```js
import React from "react";
import {angularizeDirective} from "react-in-angularjs";

const SpecialTableHeader = ({data}) =>  {
  const sort = () => {
    // Very special sort logic
  } 

  return (  
    <thead>
      <tr>
        <th onClick={sort}>Something</th>
      </tr>
    </thead>
  );
};

angularizeDirective(SpecialTableHeader, "specialTableHeader", angular.module("app"), {
  data: "<"	
});
```

```html
<table>
    <thead special-table-header data="data"></thead>
    <tbody>
    ...etc.
</table>
```

By default this uses `replace: true` so your HTML stays intact with no wrapping
tag.

## Caveats

### AngularJS within React

You can't use AngularJS components within the React render so you'll need to work bottom up, i.e. 
replace low level components first. Low level components can be then be imported directly into
your React components as well as used in legacy AngularJS (assuming they are angularized).

### Two Way Bindings

Two way bindings are not recommended, either by the AngularJS team or by me. However, it's not always possible to
remove them in a legacy application. In those cases, you can apply changes in two ways:

###### Use $timeout

```js
const TodoItem = ({todo}) => {
  // imagine some React component with a change handler
  const onChange = () => {
    // get Angular's $timeout wrapper using getService
    const $timeout = getService("$timeout"); 
    $timeout(() => {
      todo.value = "new value"
    });
  }	
}
```

###### Use $scope

react-in-angularjs provides the wrapping AngularJS's component $scope as a prop

```js
const TodoItem = ({todo, $scope}) => {
  // imagine some React component with a change handler
  const onChange = () => {
    $scope.$apply(() => {
      // $scope = AngularJS component scope, provided on a prop
      todo.value = "new value"
    });
  };
}
```