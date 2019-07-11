"use strict";

var React = require("react");

var ReactDOM = require("react-dom");

var gaveWarning = false;

var angularize = function angularize(Component, componentName, angularApp, bindings) {
  if (typeof window === "undefined" || typeof angularApp === "undefined") return;
  angularApp.component(componentName, {
    bindings: bindings,
    controller: ["$element", function ($element) {
      var _this = this;

      for (var bindingKey in bindings) {
        if (!gaveWarning && bindings.hasOwnProperty(bindingKey) && bindings[bindingKey] === "=") {
          console.warn("react-in-angularjs: You are using two-way bindings. This is not recommended. You'll need to apply changes via this.props.$scope.$apply.");
          gaveWarning = true;
        }
      }

      if (window.angular) {
        this.$scope = window.angular.element($element).scope();
      }

      this.$onChanges = function () {
        ReactDOM.render(React.createElement(Component, _this), $element[0]);
      };
    }]
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