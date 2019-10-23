// Code for how $compile might work
// Not ready to push this out into the wider world yet but wanted to save it somewhere

this.$onChanges = () => {
	const element = $element[0];

	// Render in React
	ReactDOM.render(React.createElement(Component, this), element);

	// If the angularized React component created HTML, run that child HTML through $compile
	// to hook up any AngularJS components within
	const contents = element.children && element.children.length > 0 ? element.children[0] : null;
	if (contents) {
		$compile(contents)(this.$scope)
	}
};
