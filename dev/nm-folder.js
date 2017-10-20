/**
 * NEMO
 * 
 * NOTE: All the functions and idea assume the standard nemo-folder structure.
 */

// local variables for all functions (ORDER MATTERS)
//var file_edgejs = '_edge.js';                                                   // typical part of filename of animation.
var folder_publishweb = '\/publish\/web';                                        // First character is '/' due to dw.browseForFolderURL();
var folder_web = '\/web';                                                       // First character is '/' due to dw.browseForFolderURL();
var folder_anime = '\/animations';
var folder_anime_src = '\/animations_src';
var delimiter_path = '\/';
var delimiter_folder_nemo = '\/_web'; 

//var REGEX_PATH = /^(.*[\\\/])/;                                                 // everything from begin up to last '/'.
var REGEX_TRAILING_PUBLISHWEB = /publish\/web$/;
var REGEX_TRAILING_PUBLISH = /publish$/;
var REGEX_TRAILING_PUBLISHWEBIMG = /publish\/web$/;
var REGEX_TRAILING_IMG = /images$/;
var REGEX_TRAILING_INCLUDES = /edge\_includes$/;                                               
//var REGEX_NEMOWEBFOLDER = /(\/_web)[\s\S]*/;                                      // everything from '_web' to end.

// local variables initialized by functions,
// Due to size do not use dw.getDocumentDOM().URL

/* !WARNING! THESE PATH VALUES HAVE TO BE INITIATED EVERYTIME ANY OF THESE FUNCTIONS ARE USED, JUST TO BE SURE. */
var abs_doc_path;                     // current document.  URI_path ends with 'file.html', dw API: docPathURL
var abs_folder_path;                   // current (_web) folder.    URI_path ends with '/'
var abs_root_path;           // topic (NL: module) folder. URI_path ends with folder name, dw API: siteRootURL
var abs_animations_path;

/**
 * This functions has to be called everytime as first, before using any other functions from this file
 * This is due to all tabs in dreamweaver sharing this file. Also the persistence of variables in '.../Configuration/Objects' the dreamweaver dir is shared as well.
 * 
 * The absolute document, folder and root paths of the current file are initiated.
 */
function nemo_initPaths() {
    abs_doc_path = dw.getDocumentPath('document');
    abs_folder_path = nemo_getParentFolderPath(this.abs_doc_path);
    abs_root_path = nemo_getStringSliceUpTo(this.abs_doc_path, delimiter_folder_nemo);
    abs_dest_path = abs_root_path + delimiter_folder_nemo;
    abs_animations_path = abs_dest_path + folder_anime;
}

/**
 * Checks if input folder is an eligible animation folder, i.e. is published
 * If it is eligible it will return the published folder.
 * 
 * @param {string} folder_path - absolute folder URI
 * @example
 * // returns (if valid): "file:///C:/.../vermogen_10/publish/web"
 * nemo_isValidAnimeFolder("file:///C:/.../vermogen_10");
 * @example
 * // returns (if valid): "file:///C:/.../vermogen_10/publish/web"
 * nemo_isValidAnimeFolder("file:///C:/.../vermogen_10/publish");
 * @example
 * // returns (if valid): "file:///C:/.../vermogen_10/publish/web"
 * nemo_isValidAnimeFolder("file:///C:/.../vermogen_10/publish/web");
 * @example
 * // returns (if unvalid): false
 * nemo_isValidAnimeFolder(true);
 * @returns {string | boolean} URI or false.
 */
function nemo_isValidAnimeFolder(folder_path) {
    try {
        if (typeof folder_path !== 'string' && typeof folder_path != 'boolean') {
            throw "ERROR: Wrong input; nemo_isValidAnimeFolder's argument is of type 'string' or 'boolean'.";
        }
    } catch(err) {
        alert(err);
    }

    if (folder_path === "" || typeof folder_path === 'boolean') {
        publish_path = false;
    } else if (REGEX_TRAILING_PUBLISHWEB.test(folder_path)) {
        // it is a "ANIMATION/publish/web/" path
        publish_path = folder_path;
    } else if (REGEX_TRAILING_PUBLISH.test(folder_path)) {
        // it is a "ANIMATION/publish/" path
        publish_path = folder_path + folder_web;
    } else if (REGEX_TRAILING_PUBLISHWEBIMG.test(folderpath)) {
        // it is a "ANIMATION/publish/web/images" path
        publish_path = nemo_getStringSliceUpTo(folder_path, delimiter_path);
    } else if (REGEX_TRAILING_IMG.test(folder_path) || REGEX_TRAILING_INCLUDES.test(folder_path)) {
        // it is a "ANIMATION/images" or "ANIMATION/edge_includes" path
        publish_path = nemo_getStringSliceUpTo(folder_path, delimiter_path) + folder_publishweb;
    } else {
        publish_path = folder_path + folder_publishweb;
    }

    // Condition makes it possible that publish_path can be false,
    // alert message can be defined at one location, instead of multiple.
    if (publish_path && dw.exists(publish_path)) {
    //if (publish_path && DWfile.exists(publish_path)) {
        return publish_path;
    } else {
        alert("Could not find published folder.\nPlease publish (Ctrl+Alt+S) your animation first.");
        return false;
    }     
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
 * Extracts the absolute path from the input (<tt>path</tt>), from beginning up to (not including) the last '/'.
 * If given a URI it thus returns the URI of the parent folder.
 *
 * @param {string} [path = dw.getDocumentPath('document')] - input folder or file path.
 * @example
 * // returns "file:///C:/Name/folder"
 * nemo_getParentFolderPath("file:///C:/Name/folder/name.txt");
 * @example
 * // returns "file:///C:/Name"
 * nemo_getParentFolderPath("file:///C:/Name/folder");
 * @example
 * // returns "file:///C:/Name/folder"
 * nemo_getParentFolderPath("file:///C:/Name/folder/")
 * @returns {string} A folder URI ("file:///...").
 */
function nemo_getParentFolderPath(path) {
    var folder_path;

    if (path == null) {
        folder_path = abs_doc_path;
    } else {

        try {
            if (typeof path !== 'string') throw "is not of type string.";
            //if (!DWfile.exists(path)) throw "is not an existing URIs."; // Should be active in the end product...
        } catch(err) {
            alert("ERROR: nm_getFolderPath's argument " + err);
        }

        folder_path = path;
    } // can also use value = thing1 || default (if thing1, else default);

    return nemo_getStringSliceUpTo(folder_path, delimiter_path);
}

/**
 * Asks the user to select a folder containing Edge Animate animations.
 * 
 * @param {string} [folder_path = "/animations_src"] - starting folder, relative to abs_root_path
 * @example
 * // if no user input, then returns false; else returns "file:///.../foldername";
 * nemo_getFolderPathBrowse("animations_src")
 * @returns {string | boolean} An URI ("file:///.../foldername") or false.
 */
function nemo_getFolderPathBrowse(folder_path) {
    if (folder_path == null) {
        folder_path = folder_anime_src;
    }
    var start_path = abs_root_path + folder_path;
    var absFolderPath = "";

    if (dw.exists(start_path)) {
    // if (DWfile.exists(start_path)) {
        absFolderPath = dw.browseForFolder();//dw.doURLEncoding(dw.browseForFolderURL("Please select an animation folder.", start_path));
    } else {
        alert("ERROR: nm.getFolderPathBrowse's given startFolder does not exist or is invalid input.");
    }
    
    // just to make sure it is absolute
    if (absFolderPath === "") {
        return false;
    } else {
        return absFolderPath;//dw.relativeToAbsoluteURL(abs_doc_path, abs_folder_path, absFolderPath);
    }
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