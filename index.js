"use strict";

var React = require("react");

var ReactDOM = require("react-dom");

var angularize = function angularize(Component, componentName, angularApp, bindings) {
  bindings = bindings || {};
  if (typeof window === "undefined" || typeof angularApp === "undefined") return;
  angularApp.component(componentName, {
    bindings: bindings,
    controller: ["$element", function ($element) {
      var _this = this;

      if (window.angular) {
        // Add $scope
        this.$scope = window.angular.element($element).scope(); // Create a map of objects bound by '='
        // For those that exists, use $doCheck to check them using angular.equals and trigger $onChanges

        var previous = {};

        this.$onInit = function () {
          for (var _i = 0, _Object$keys = Object.keys(bindings); _i < _Object$keys.length; _i++) {
            var bindingKey = _Object$keys[_i];

            if (bindings[bindingKey] === "=") {
              previous[bindingKey] = window.angular.copy(_this[bindingKey]);
            }
          }
        };

        this.$doCheck = function () {
          for (var _i2 = 0, _Object$keys2 = Object.keys(previous); _i2 < _Object$keys2.length; _i2++) {
            var previousKey = _Object$keys2[_i2];

            if (!window.angular.equals(_this[previousKey], previous[previousKey])) {
              _this.$onChanges();

              return;
            }
          }
        };
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