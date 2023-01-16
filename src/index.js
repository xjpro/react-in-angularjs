const React = require("react");
const ReactDOMClient = require("react-dom/client");

const isPlainObject = require("lodash/isPlainObject");
const isEqual = require("lodash/isEqual");

function angularize(Component, componentName, angularApp, bindings) {
  bindings = bindings || {};
  if (typeof window === "undefined" || typeof angularApp === "undefined")
    return;

  angularApp.component(componentName, {
    bindings,
    controller: [
      "$element",
      function ($element) {
        // Create react root for this element
        this.root = ReactDOMClient.createRoot($element[0]);

        if (window.angular) {
          // Add $scope
          this.$scope = window.angular.element($element).scope();

          // Create a map of objects bound by '='
          // For those that exists, use $doCheck to check them using angular.equals and trigger $onChanges
          const previous = {};
          this.$onInit = () => {
            for (let bindingKey of Object.keys(bindings)) {
              if (/^data[A-Z]/.test(bindingKey)) {
                console.warn(
                  `'${bindingKey}' binding for ${componentName} component will be undefined because AngularJS ignores attributes starting with data-`
                );
              }

              if (bindings[bindingKey] === "=") {
                previous[bindingKey] = window.angular.copy(this[bindingKey]);
              }
            }
          };

          this.$doCheck = () => {
            for (let previousKey of Object.keys(previous)) {
              if (!equals(this[previousKey], previous[previousKey])) {
                this.$onChanges();
                previous[previousKey] = window.angular.copy(this[previousKey]);
                return;
              }
            }
          };
        }

        this.$onChanges = () => {
          this.root.render(React.createElement(Component, this));

        this.$onDestroy = () => {
          this.root.unmount();
        };
      },
    ],
  });
}

function angularizeDirective(Component, directiveName, angularApp, bindings) {
  bindings = bindings || {};
  if (typeof window === "undefined" || typeof angularApp === "undefined")
    return;

  angularApp.directive(directiveName, function () {
    return {
      scope: bindings,
      replace: true,
      link: function (scope, element) {
        // Add $scope
        scope.$scope = scope;
        const root = ReactDOMClient.createRoot($element[0]);

        // First render - needed?
        root.render(React.createElement(Component, scope));

        // Watch for any changes in bindings, then rerender
        const keys = [];
        for (let bindingKey of Object.keys(bindings)) {
          if (/^data[A-Z]/.test(bindingKey)) {
            console.warn(
              `"${bindingKey}" binding for ${directiveName} directive will be undefined because AngularJS ignores attributes starting with data-`
            );
          }
          if (bindings[bindingKey] !== "&") {
            keys.push(bindingKey);
          }
        }

        scope.$watchGroup(keys, (root) => {
          root.render(React.createElement(Component, scope));
        });

        scope.$on("$destroy", function () {
          root.unmount();
        });
      },
    };
  });
}

function getService(serviceName) {
  if (typeof window === "undefined" || typeof window.angular === "undefined")
    return {};
  return window.angular.element(document.body).injector().get(serviceName);
}

function equals(o1, o2) {
  // Compare plain objects without equality check that angular.equals does
  if (isPlainObject(o1) && isPlainObject(o2)) {
    return isEqual(o1, o2);
  }
  return window.angular.equals(o1, o2);
}

module.exports = {
  getService,
  angularize,
  angularizeDirective,
};
