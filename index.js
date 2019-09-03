"use strict";

var React = require("react");

var ReactDOM = require("react-dom");

var angularize = function angularize(Component, componentName, angularApp, bindings) {
  if (typeof window === "undefined" || typeof angularApp === "undefined") return;
  angularApp.component(componentName, {
    bindings: bindings,
    controller: ["$element", function ($element) {
      var _this = this;

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