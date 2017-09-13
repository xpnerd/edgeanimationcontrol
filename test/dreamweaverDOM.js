(function() {
	"use strict";

	/**
	 * DreamweaverDOM returns a document model, similar to the 
	 * document model as given within the Adobe Dreamweaver 
	 * software. To test the script without the need of this 
	 * software, this implementation is made.
	 * @param  {String} filepath Absolute filepath to *.html file
	 * @return {Object}          Dreamweaver document model object
	 */
	module.exports = function(filepath) {
		var jsdom = require("jsdom");
		var fileurl = require('file-url');
		const { JSDOM } = jsdom;
		var fs = require("fs");

		// Load the file
		var contents = fs.readFileSync(filepath, 'utf-8').toString();
		if(!contents) return {};

		// Create the document model
		var docurl = fileurl(filepath);
		var DWDOM = new JSDOM(contents, {
  			url: docurl
  		});

		// Add dreamweaver document functions
		DWDOM.window.document.documentType = "html";
		DWDOM.window.document.getTitle = function() {
			return this.title;
		}
		DWDOM.window.document.getParseMode = function() {
			return "html";
		}

		// Return the document model
		return DWDOM.window.document;
	}
})();