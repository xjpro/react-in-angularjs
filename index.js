"use strict";

var React = require("react");

var ReactDOM = require("react-dom");

var gaveWarning = false; // Fix Function#name on browsers that do not support it (IE):
// https://stackoverflow.com/questions/6903762/function-name-not-supported-in-ie

if (!function f() {}.name) {
  Object.defineProperty(Function.prototype, "name", {
    get: function get() {
      var name = (this.toString().match(/^function\s*([^\s(]+)/) || [])[1];
      Object.defineProperty(this, "name", {
        value: name
      });
      return name;
    }
  });
}

var angularize = function angularize(Component, angularApp, bindings) {
  if (typeof window === "undefined" || typeof angularApp === "undefined") return;
  var componentName = "".concat(Component.name.charAt(0).toLowerCase()).concat(Component.name.slice(1));
  angularApp.component(componentName, {
    bindings: bindings,
    controller: function controller($element) {
      var _this = this;

      for (var bindingKey in bindings) {
        if (!gaveWarning && bindings.hasOwnProperty(bindingKey) && bindings[bindingKey] === "=") {
          console.warn("react-in-angularjs: You are using two-way bindings. This is not recommended. You'll need to apply changes via this.props.$$scope.$apply.");
          gaveWarning = true;
        }
      }

      if (window.angular) {
        this.$$scope = window.angular.element($element).scope();
      }

      this.$onChanges = function () {
        ReactDOM.render(React.createElement(Component, _this), $element[0]);
      };
    }
  });
};

var getService = function getService(serviceName) {
  if (typeof window === "undefined" || typeof window.angular === "undefined") return {};
  return window.angular.element(document.body).injector().get(serviceName);
};

module.exports = {
  getService: getService,
  angularize: angularize
};