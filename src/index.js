const React = require("react");
const ReactDOM = require("react-dom");
import { createRoot } from 'react-dom/client';

const isPlainObject = require("lodash/isPlainObject");
const isEqual = require("lodash/isEqual");

function angularize(Component, componentName, angularApp, bindings) {
  bindings = bindings || {};
  if (typeof window === "undefined" || typeof angularApp === "undefined")
    return;

  var componentOptions = {
      bindings,
      template: options?.transclude ? '<ng-transclude></ng-transclude>' : undefined,
      controller: [
        "$element",
        "$timeout",
        function ($element, $timeout) {

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
          
          this.contentChangedCallback = () => {
            this.reactRoot.render(React.createElement(Component, this, parse($element.html()) ));
          };
  
          this.$onChanges = () => {
            if (options?.transclude) {

              // need to find a better to get compiled and linked html for transclude content.
              // also be best to find a way to convert DOM to React element.
              // domToReact in html-react-parser doesn't work well for HTML elements that don't have 'type' property.
             
              $timeout( () => {

                if( !this.reactRoot) {
                  const reactContainer = $element.clone();
                  reactContainer.insertAfter($element);
                  this.reactRoot = createRoot(reactContainer[0]);
                  this.reactRoot.render(React.createElement(Component, this, parse($element.html()) ));

                  const observer = new MutationObserver(this.contentChangedCallback);
              
                  observer.observe($element[0], {
                    attributes: true,
                    childList: true,
                    subtree: true,
                    characterData: true,
                  });     
                  $element.hide();
                }     
              }, 0);
            } else {
              createRoot($element[0]).render(React.createElement(Component, this ));
            }
          };
        },
      ],
  };

  if (options) {
    componentOptions = { ...componentOptions, ...options };
  }

  angularApp.component(componentName, componentOptions);
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

        // First render - needed?
        ReactDOM.render(React.createElement(Component, scope), element[0]);

        // Watch for any changes in bindings, then rerender
        const keys = [];
        for (let bindingKey of Object.keys(bindings)) {
          if (/^data[A-Z]/.test(bindingKey)) {
            console.warn(
              `'${bindingKey}' binding for ${directiveName} directive will be undefined because AngularJS ignores attributes starting with data-`
            );
          }
          if (bindings[bindingKey] !== "&") {
            keys.push(bindingKey);
          }
        }

        scope.$watchGroup(keys, () => {
          ReactDOM.render(React.createElement(Component, scope), element[0]);
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
