const React = require("react");
const ReactDOM = require("react-dom");

const angularize = (Component, componentName, angularApp, bindings) => {
	if (typeof window === "undefined" || typeof angularApp === "undefined") return;

	angularApp.component(componentName, {
		bindings,
		controller: ["$element", function ($element) {
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
