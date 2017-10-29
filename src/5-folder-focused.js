/*
 * FOLDER
 * 
 * functions with focus on folders
 */

/**
 * Get the current folder path.
 * @deprecated since version 2.2.0 - see nemo_getParentFolderPath
 * @param {string} path - an valid URI (file://URL)
 * @returns {string | boolean} URI (file://URL) or false. 
 */
function nemo_getFolderPath(path) {
    var REGEX_PATH = /^(.*[\\\/])/;
    var folder_path;
    if (path == null) {
        folder_path = dw.getDocumentPath('document');
    } else {
        folder_path = path;
    } // can also use value = thing1 || default (if thing1, else default);

    // Why this is done, I am not sure of seems an extra pecaution, but don't know/see why needed.
    folder_path = folder_path && REGEX_PATH.exec(folder_path);
    folder_path = folder_path.length > 0 && folder_path[0];
    return folder_path;
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
            if (!DWfile.exists(path)) throw "is not an existing URIs.";
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

    if (DWfile.exists(start_path)) {
        absFolderPath = dw.doURLEncoding(dw.browseForFolderURL("Please select an animation folder.", start_path));
    } else {
        alert("ERROR: nm.getFolderPathBrowse's given startFolder does not exist or is invalid input.");
    }
    
    // just to make sure it is absolute
    if (absFolderPath === "") {
        return false;
    } else {
        return dw.relativeToAbsoluteURL(abs_doc_path, abs_folder_path, absFolderPath);
    }
}