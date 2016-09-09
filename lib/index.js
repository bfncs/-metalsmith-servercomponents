const components = require('server-components');
const async = require('async');
const fs = require('fs');

function plugin(opts) {
	const options = opts || {};

	const dir = options.directory || '/components';


	const registerComponents = (componentsDirectory, done) => {
		const componentCreators = [];
		fs.readdir(componentsDirectory, (error, list) => {
			if (error) {
				console.error('Cannot read from directory %s. Aborting.', componentsDirectory);
				process.exit(1);
			}

			list.forEach(file => {
				const path = componentsDirectory + '/' + file;
				componentCreators.push(callback => (
					fs.stat(path, (err, stat) => {
						if (stat && stat.isDirectory()) {
							return;
						}
						const component = require(path);
						component(components);
						callback();
					})
				));
			});
			async.parallel(componentCreators, done);
		});
	};

	const transformFiles = (files, done) => {
		const fileRenderers = [];
		Object.keys(files).forEach(fileName => {
			const fileMetadata = files[fileName];
			const fileContent = fileMetadata.contents.toString();

			fileRenderers.push(callback =>
				components.renderPage(fileContent).then(output => {
					files[fileName].contents = new Buffer(output); // eslint-disable-line no-param-reassign
					callback();
				})
			);
		});
		async.parallel(fileRenderers, done);
	};

	return (files, metalsmith, pluginDone) => {
		const componentsDirectory = metalsmith._directory + dir; // eslint-disable-line no-underscore-dangle
		registerComponents(componentsDirectory, () => (transformFiles(files, pluginDone)));
	};
}

module.exports = plugin;
