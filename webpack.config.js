module.exports = {
	devtool: "source-map",
	entry: './src/index.jsx',
	output: {
		filename: "index.js",
		path: __dirname
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			}
		]
	}
};
