const React = require("react");
const ReactDOM = require("react-dom");

let gaveWarning = false;

const angularize = (Component, componentName, angularApp, bindings) => {
	if (typeof window === "undefined" || typeof angularApp === "undefined") return;

	angularApp.component(componentName, {
		bindings,
		controller: ["$element", function ($element) {
			for (let bindingKey in bindings) {
				if (!gaveWarning && bindings.hasOwnProperty(bindingKey) && bindings[bindingKey] === "=") {
					console.warn("react-in-angularjs: You are using two-way bindings. This is not recommended. You'll need to apply changes via this.props.$scope.$apply.");
					gaveWarning = true;
				}
			}

			if (window.angular) {
				this.$scope = window.angular.element($element).scope();
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