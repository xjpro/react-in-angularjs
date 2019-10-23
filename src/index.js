const React = require("react");
const ReactDOM = require("react-dom");

const angularize = (Component, componentName, angularApp, bindings) => {
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
						if (!window.angular.equals(this[previousKey], previous[previousKey])) {
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
};

const getService = serviceName => {
	if (typeof window === "undefined" || typeof window.angular === "undefined") return {};
	return window.angular.element(document.body).injector().get(serviceName);
};

module.exports = {
	getService,
	angularize
};
