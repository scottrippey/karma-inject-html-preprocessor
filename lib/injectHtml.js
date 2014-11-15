module.exports = createInjectHtmlPreprocessor;
createInjectHtmlPreprocessor.$inject = ['logger', 'config.basePath', 'config.injectHtml'];
function createInjectHtmlPreprocessor(logger, basePath, config) {
	
	function extractBody(content) {
		// (TODO)
		return content;
	}
	function wrapWithDocumentWrite(javascript) {
		return "document.write(\n" + toJSString(javascript) + "\n);"
	}
	function toJSString(content) {
		return "'" + content.replace(/\\/g, '\\\\').replace(/'/g, '\\\'').replace(/\r?\n/g, '\\\n') + "'";
	}
	
	//config = typeof config === 'object' ? config : {};

	var log = logger.create('preprocessor.injectHtml');

	return function(content, file, done) {
		log.debug('Processing "%s".', file.originalPath);

		if (!/\.js$/.test(file.path)) {
			file.path = file.path + '.js';
		}
		
		var body = extractBody(content);
		var result = wrapWithDocumentWrite(body);
		
		done(result);
	};
}