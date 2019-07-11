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

const TodoList = ({todos}) =>  {
  return (
    <ol>
      {todos.map(todo => (
        <li>{todo.description}</li>
      ))}
    </ol>
  );
}

// this also works just as well with class components

angularize(TodoList, "todoList", angular.module("app"), {
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

import {getService} from "react-in-angularjs"
const todoService = getService("todoService");
// Now you've got the singleton instance of it
```

## Building

Since you likely don't have a normal React entry point, you'll need to leverage webpack's 
ability to have multiple entry points. I accomplish this in my own project using `glob`:

```js
const glob = require("glob");
const path = require("path");

module.exports = {
  entry: glob.sync("./app/**/!(*.test).jsx"),
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist") 
  }
};
```

## Caveats

### AngularJS within React

You can't use AngularJS components within the React render so you'll need to work bottom up, i.e. 
replace low level components first. Low level components can be then be imported directly into
your React components as well as used in legacy AngularJS (assuming they are also angularized).

### Two Way Bindings

Two way bindings are not recommended, either by the AngularJS team or by me. However, it's not always possible to
remove them in a legacy application. In those cases, you can apply changes in two ways:

##### Use $timeout
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

##### Use $scope
```js
const TodoItem = ({todo, $scope}) => {
  // imagine some React component with a change handler
  const onChange = () => {
    $scope.$apply(() => {
      // $scope = AngularJS component scope, provided on a prop via react-in-angularjs
      todo.value = "new value"
    });
  };
}
```