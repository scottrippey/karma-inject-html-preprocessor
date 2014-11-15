module.exports = createInjectHtmlPreprocessor;
createInjectHtmlPreprocessor.$inject = ['logger', 'config.basePath', 'config.injectHtml'];
function createInjectHtmlPreprocessor(logger, basePath, config) {
	
	function extractBody(content) {
		var bodyIndex = content.indexOf('<body');
		if (bodyIndex !== -1) {
			var start = content.indexOf('>', bodyIndex) + 1;
			var end = content.indexOf('</body>');
			if (start !== -1 && end !== -1) {
				return content.substr(start, end - start);
			}
		}
		return content;
	}
	function wrapWithDocumentWrite(javascript) {
		return "document.write(\n" + toJSString(javascript) + "\n);"
	}
	function toJSString(content) {
		return "'" + content.replace(/\\/g, '\\\\').replace(/'/g, '\\\'').replace(/\r?\n/g, '\\\n') + "'";
	}
	
	config = typeof config === 'object' ? config : { extractBody: false };

	var log = logger.create('preprocessor.injectHtml');

	return function(content, file, done) {
		log.debug('Processing "%s".', file.originalPath);

		if (!/\.js$/.test(file.path)) {
			file.path = file.path + '.js';
		}
		
		if (config.extractBody) {
			content = extractBody(content);
		}
		
		var result = wrapWithDocumentWrite(content);
		
		done(result);
	};
}