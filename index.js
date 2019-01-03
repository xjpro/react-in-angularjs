const React = require("react");
const ReactDOM = require("react-dom");

const angularize = (Component, angularApp, bindings) => {
	if (typeof window === "undefined" || typeof angularApp === "undefined") return;

	const componentName = `${Component.name.charAt(0).toLowerCase()}${Component.name.slice(1)}`;
	angularApp.component(componentName, {
		bindings,
		controller: function ($element) {
			this.$onChanges = () => {
				ReactDOM.render(React.createElement(Component, this), $element[0]);
			};
		}
	})
};

module.exports = angularize;
