/*
 * GENERAL
 * 
 * functions that have general focus. 
 */

/**
 * This functions has to be called everytime as first, before using any other functions from this file
 * This is due to all tabs in dreamweaver sharing this file. Also the persistence of variables in '.../Configuration/Objects' the dreamweaver dir is shared as well.
 * 
 * The absolute document, folder and root paths of the current file are initiated.
 * @returns {void} nothing.
 */
function nemo_initPaths() {
    abs_doc_path = dw.getDocumentPath('document');
    abs_folder_path = nemo_getParentFolderPath(abs_doc_path);
    
    /*
     * Standard nemo structure is ".../topic/_web/subtopic.html", with the .html being the abs_doc_path.
     * Other folders are ".../topic/animations_src", so ".../topic" is our root path.
     * For robustness we just go twice up in the tree, instead of cutting off everthing after "/_web".
     * 
     * nemo_getStringSliceUpTo(abs_doc_path, delimiter_folder_nemo);
     * 
     * Same idea for abs_dest_path
     */
    abs_root_path = nemo_getParentFolderPath(abs_folder_path);
    abs_dest_path = abs_folder_path; //abs_root_path + delimiter_folder_nemo;
    abs_animations_path = abs_dest_path + folder_anime;
    abs_images_path = abs_dest_path + folder_image;
}

/**
 * Takes everything from (not including) the last delimiter as substring. 
 * If any input is of the wrong type, it outputs the original <tt>in_string</tt>.
 * 
 * @param {string} in_string - a string
 * @param {string} delimiter - a delimiter
 * @example
 * // returns "/anything"
 * nemo_getStringSliceUpTo("file:///C:/name/_web/name/_web/anything". "\/_web");
 * @example
 * // aerts and returns 345 (since it is a number!)
 * nemo_getStringSliceUpTo(345, "3");
 * @example
 * // returns "file:///C:/name/_web/name"
 * nemo_getStringSliceUpTo("file:///C:/name/_web/name", "xp");
 * @return {string} A substring/slice of the original input string. 
 */
function nemo_getStringTrailing(in_string, delimiter) {
    if (typeof in_string === 'string' && typeof delimiter === 'string') {
        out_string = in_string.slice(in_string.lastIndexOf(delimiter) + delimiter.length);
    } else {
        alert("ERROR: Wrong input type, make sure the input type is 'string'.");
        out_string = in_string;
    }

    return out_string;
}

/**
 * Takes everything up to (not including) the last delimiter as substring. 
 * If any input is of the wrong type, it outputs the original <tt>in_string</tt>.
 * 
 * @param {string} in_string - a string
 * @param {string} delimiter - a delimiter
 * @example
 * // returns "file:///C:/name/_web/name"
 * nemo_getStringSliceUpTo("file:///C:/name/_web/name/_web/anything". "\/_web");
 * @example
 * // returns 345, which is a number!
 * nemo_getStringSliceUpTo(345, "3");
 * @example
 * // returns "file:///C:/name/_web/name"
 * nemo_getStringSliceUpTo("file:///C:/name/_web/name", "xp");
 * @return {string} A substring/slice of the original input string. 
 */
function nemo_getStringSliceUpTo(in_string, delimiter) {
    if (typeof in_string === 'string' && typeof delimiter === 'string') {
        out_string = in_string.slice(0, in_string.lastIndexOf(delimiter));
    } else {
        alert("ERROR: Wrong input type, make sure the input type is 'string'.");
        out_string = in_string;
    }

    return out_string;
}

/**
 * Checks if a certain string is contained in a list.
 * @param {Object} a - a list object.
 * @param {string} obj - the value that is tested.
 * @returns {boolean} true or false.
 */
function nemo_contains(a, obj) {
    var i = a.length;
    while (i--) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

/**
 * Checks if the current DOM is a special Nemo DOM (document)
 * 
 * @returns {boolean} true or false
 */
function nemo_isValidDocument() {
    return (dw.getDocumentDOM() != null && dw.getDocumentDOM().getElementById('slides') != null && dw.getDocumentDOM().documentType != 'XSLT-fragment' && dw.getDocumentDOM().getParseMode() == 'html' && (dw.getActiveWindow(true) != null && dw.getActiveWindow(true).allowsEdits()));
}

/**
 * Simple function that recursively asks the user to do a task, 
 * until the user explicitly confirms it wants to quit.
 * It automatically adds the path to the published folder.
 * 
 * @param {string} message - confirmation message that is shown.
 * @param {function} task - a function without arguments.
 * @example
 * // returns a nonempty URI or false.
 * nemo_recurseTask('Are you sure to quit?', nemo_getParentFolderPathBrowse);
 * @returns {string | boolean} An URI or false.
 */
function nemo_recurseTask(message, task) {
    var output = task();

    while (!output && !confirm(message)) {
        output = task();
    }

    return output;
}