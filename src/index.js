const React = require("react");
const ReactDOM = require("react-dom");
const isPlainObject = require("lodash/isPlainObject");
const isEqual = require("lodash/isEqual");

function angularize(Component, componentName, angularApp, bindings) {
	bindings = bindings || {};
	if (typeof window === "undefined" || typeof angularApp === "undefined") return;

	angularApp.component(componentName, {
		bindings,
		controller: ["$element", function ($element) {
			if (window.angular) {
				// Add $scope
				this.$scope = window.angular.element($element).scope();

				// Create a map of objects bound by '='
				// For those that exists, use $doCheck to check them using angular.equals and trigger $onChanges
				const previous = {};
				this.$onInit = () => {
					for (let bindingKey of Object.keys(bindings)) {
						if (bindings[bindingKey] === "=") {
							previous[bindingKey] = window.angular.copy(this[bindingKey]);
						}
					}
				};

				this.$doCheck = () => {
					for (let previousKey of Object.keys(previous)) {
						if (!equals(this[previousKey], previous[previousKey])) {
							this.$onChanges();
							return;
						}
					}
				}
			}

			this.$onChanges = () => {
				ReactDOM.render(React.createElement(Component, this), $element[0]);
			};
		}]
	})
}

function angularizeDirective(Component, directiveName, angularApp, bindings) {
	bindings = bindings || {};
	if (typeof window === "undefined" || typeof angularApp === "undefined") return;

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
					if (bindings[bindingKey] !== "&") {
						keys.push(bindingKey);
					}
				}

				scope.$watchGroup(keys, () => {
					ReactDOM.render(React.createElement(Component, scope), element[0]);
				});
			}
		}
	});
}

function getService(serviceName) {
	if (typeof window === "undefined" || typeof window.angular === "undefined") return {};
	return window.angular.element(document.body).injector().get(serviceName);
}

function equals(o1, o2) {
	// Compare plain objects without equality check that angular.equals does
	if (isPlainObject(o1) && isPlainObject(o2)) {
		return isEqual(o1, o2);
	}
	return window.angular.equals(o1, o2)
}

module.exports = {
	getService,
	angularize,
	angularizeDirective
};
