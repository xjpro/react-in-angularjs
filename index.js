import React from "react";
import ReactDOM from "react-dom";

const angularize = (Component, angularApp, bindings) => {
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

export default angularize;
