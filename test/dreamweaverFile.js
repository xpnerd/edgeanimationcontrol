(function() {
	"use strict";

	/**
	 * [exports description]
	 * @return {[type]} [description]
	 */
	var DWfile = function () {
		var fs = require("fs");
		var url = require("url");
		var path = require("path");

		function exists(filepathURI) {
			var filepath = url.parse(filepathURI).path;
			return fs.existsSync(filepath);
		}

		function read(filepathURI) {
			var filepath = url.parse(filepathURI).path;
			return fs.readFileSync(filepath, {"encoding" : "UTF-8"});
		}

		return {
			exists : exists,
			read : read
		};

	}();

	global.DWfile = DWfile;

})();