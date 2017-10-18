/**
 * NEMO
 * 
 * NOTE: All the functions and idea assume the standard nemo-folder structure.
 */

// local variables for all functions
var REGEX_PATH = /^(.*[\\\/])/;                                                 // everything from begin up to last '/'.
var REGEX_PUBLISHWEB = /publish\/web/;
var REGEX_PUBLISH = /publish/;                                               
var REGEX_NEMOWEBFOLDER = /(_web)[\s\S]*/;                                      // everything from '_web' to end.

// Due to size do not use dw.getDocumentDOM().URL
var abs_doc_path = dw.getDocumentPath('document');                              // current document.  URL_path ends with 'file.html', dw API: docPathURL
var abs_folder_path = nm.getFolderPath(abs_doc_path);                           // current folder.    URL_path ends with '/'
var abs_root_path = abs_folder_path.replace(REGEX_NEMOWEBFOLDER, '');           // topic (NL: module) folder. URL_path ends with '/', dw API: siteRootURL

var file_edgejs = '_edge.js';                                                   // typical part of filename of animation.
var folder_publishweb = '/publish/web';                                        // First character is '/' due to dw.browseForFolderURL();
var folder_web = '/web';                                                       // First character is '/' due to dw.browseForFolderURL();
var folder_anime_src = 'animations_src'; 

/**
 * Checks if input folder is an eligible animation folder, i.e. is published
 * 
 * @param {string} folderPath 
 * @returns {boolean} If eligible returns true, else false.
 */
function nemo_isValidAnimeFolder(folderPath) {

    if (DWfile.exists(folderPath)) {
        return true;
    } else {
        alert("Could not find published folder.\nPlease publish (Ctrl+Alt+S) your animation first.");
        return false;
    }     
}

/**
 * Extracts the absolute path from the input (<tt>path</tt>), from beginning up to the last '/'.
 *
 * @param {string} [path = dw.getDocumentPath('document')] - input folder or file path.
 * @example
 * // returns "file://C:/Name/folder/"
 * nemo_getFolderPath("file://C:/Name/folder/name.txt");
 * @example
 * // returns "file://C:/Name/folder/"
 * nemo_getFolderPath("file://C:/Name/folder/")
 * @returns {string} A folder path ("file://.../").
 */
function nemo_getFolderPath(path) {
    if (path == null) {
        folderPath = abs_doc_path;
    } else {
        folderPath = path;
    } // can also use value = thing1 || default (if thing1, else default);

    // makes sure to return only one value.
    folderPath = folderPath && REGEX_PATH.exec(folderPath);
    folderPath = folderPath.length > 0 && folderPath[0];
    return folderPath;
}

/**
 * Asks the user to select a folder containing Edge Animate animations.
 * 
 * @param {string} startFolder
 * @example
 * // if no user input, then returns ""; else returns "file://.../foldername";
 * nemo_getFolderPathBrowse("animations_src")
 * @returns {string} An absolute folder path which can be empyt ("") or full ("file://.../foldername").
 */
function nemo_getFolderPathBrowse(startFolder) {
    var startURL = abs_root_path + startFolder + '/';
    
    var absFolderPath = dw.doURLEncoding(dw.browseForFolderURL("Please select an animation folder.", startURL));

    // just to make sure it is absolute
    if (absFolderPath === "") {
        return absFolderPath;
    } else {
        return dw.relativeToAbsoluteURL(abs_doc_path, abs_folder_path, absFolderPath);
    }
}

/**
 * Simple function that recursively asks the user to select a folder, 
 * until the user explicitly confirms it wants to quit.
 * It automatically adds the path to the published folder.
 * 
 * @param {string} message - confirmation message that is shown.
 * @example
 * nemo_loopFolderPathBrowse('Are you sure to quit?');
 * @returns {string} A string with the selected path, when not selected any it returns an empty string.
 */
function nemo_loopFolderPathBrowse(message) {
    var path = nm.getFolderPathBrowse(folder_anime_src);

    while (path === "" && !confirm(message)) {
        path = nemo_getFolderPathBrowse(folder_anime_src);
    }
    
    if (path === "") {
        return path;
    } else if (REGEX_PUBLISH.test(path)) {
        // it is a ".../publish/web/ path
        return path;
    } else if (REGEX_PUBLISH.test(path)) {
        // it is a ".../publish/" path
        publish_path = folderPath + folder_web;
    } else {
        publish_path = folderPath + folder_publishweb;
    }
}