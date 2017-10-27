/**
 * Nemo for Adobe Dreamweaver,
 * Main functionalities:
 * - Add and insert Animation
 * 
 * @class
 * 
 * @author Tjibbe van der Laan
 * @author Xiaoming op de Hoek
 */
function nm() {}
nm.initPaths = nemo_initPaths;
nm.getStringTrailing = nemo_getStringTrailing;
nm.getStringSliceUpTo = nemo_getStringSliceUpTo;
nm.contains = nemo_contains;
nm.isValidDocument = nemo_isValidDocument;

nm.recurseTask = nemo_recurseTask;

nm.copyFiles = nemo_copyFiles;

nm.getParentFolderPath = nemo_getParentFolderPath;
nm.getFolderPathBrowse = nemo_getFolderPathBrowse;

nm.getSlideNodes = nemo_getSlideNodes;
nm.getCurrentSlide = nemo_getCurrentSlide;
nm.getStageWidth = nemo_getStageWidth;
nm.getStageHeight = nemo_getStageHeight;

nm.isValidAnimeFolder = nemo_isValidAnimeFolder;
nm.isValidAnimeDiv = nemo_isValidAnimeDiv;
nm.getAnimeName = nemo_getAnimeName;
nm.isModified = nemo_isModified;
nm.importEdgeFiles = nemo_importEdgeFiles;
nm.insertTag = nemo_insertTag;
nm.delEdgeActions = nemo_delEdgeActions;
nm.getEdgeAnimations = nemo_getEdgeAnimations;
nm.addEdgeAnimation = nemo_addEdgeAnimation;
nm.changeEdgeAnimation = nemo_changeEdgeAnimation;
nm.delEdgeAnimation = nemo_delEdgeAnimation;

/*
 * CONSTANTS
 * 
 * local variables for all functions (ORDER MATTERS)
 */

var class_animation = "EdgeAnimation";                      // div class of an (Edge) Animation
var id_edge_actions = "EdgeAnimationActions";
var delimiter_id_name = "_";
var delimiter_class_space = ' ';
var delimiter_file_edge = "\_edge.js";                      // Edge Animation (default) file name addition.
var delimiter_folder_nemo = '\/_web';                       // Nemo (default) web folder
var delimiter_path = '\/';                                  // URL separator
var folder_anime = '\/animations';                          // Nemo (default) animations folder path
var folder_anime_src = '\/animations_src';                  // Nemo (default) animations' source folder path
var folder_image = '\/images';                              // Nemo (default) images folder path
var folder_publishweb = '\/publish\/web';                   // Edge Animation published folder path
var folder_web = '\/web';                                   // Edge Animation web folder path
var str_slideswrapper = "slideswrapper";                    // Element id.

var delimiter_modification = "*";                           // Nemo (default) file modification, separator of information.
var file_change_script = "scripts=\[\]";                    // Nemo (default) file modification, delete extra scripts usage.
var folder_change_img = "var im='images/'";                 // Nemo (default) file modification, point to 'folder_image'
var modification_str_date = "\/\/modificationDate:";        // Nemo (default) file modification, modification date stamp/fingerprint
var modification_str_stamp = " \/* Edited by Nemo *\/ ";    // Nemo (default) file modification, stamp/fingerprint
var modification_str_update_path = "\/\/updatePath:";       // Nemo (default) file modification, update path stamp/fingerprint

var REGEX_TRAILING_PUBLISHWEB = /publish\/web$/;
var REGEX_TRAILING_PUBLISH = /publish$/;
var REGEX_TRAILING_PUBLISHWEBIMG = /publish\/web\/images$/;
var REGEX_TRAILING_IMG = /images$/;
var REGEX_TRAILING_INCLUDES = /edge\_includes$/;
var REGEX_TRAILING_EDGEFILE = /\_edge\.js/;

var REGEX_ATTR_COMPOSITIONCLASS = /AdobeEdge,('|")([^'"]+)('|")/;
/**
 * More robust then the old version: /\'\${Stage}\'[\s\S]*?\}/g.
 */
var REGEX_ATTR_OBJECT_STAGE = /style:{\'\${Stage}\'[\s\S]*?\}/g; 
var REGEX_ATTR_OBJECT_R = /(r:)[\s]{0,}\[[\s\S]*?\]/g;
var REGEX_ATTR_SIZES = /[0-9]{3,4}/g;
var REGEX_ATTR_VERSION = /vid\=/;
/**
 * Undocumented: in the published _edge.js file (minified); x1, x2 and x3 seem to hold info on:
 * current version, minimum version compatibility and build version resp.
 * If version and minimum version comp. coincinde, then x2 is the build version and x3 hold diff. info.
 */
var REGEX_ATTR_VERSION_NUM = /(x1\=\')([0-9])\./;               // main version number. We try to support versions 5.x.x or higher.
var REGEX_ATTR_UPDATE = new RegExp(modification_str_update_path + "[^" + delimiter_modification + "]*"); //RegEx, /\/\/updatePath:[^*]*/;
var REGEX_ATTR_MODIFICATION = new RegExp(modification_str_date + "[^" + delimiter_modification + "]*");  //RegEx, /\/\/modificationDate:[^*]*/;
var REGEX_ATTR_CLASS = new RegExp('\\b' + class_animation + '\\b');
var REGEX_CHANGE_IMG_LOC = /(var im=')[\S\s]*?'/g;
var REGEX_CHANGE_SCRIPTS = /scripts=\[[^\]]*\]/;
var REGEX_CHANGE_SPECIAL = /^[_\d]*| /g; //remove any digits and underscores in front of the first proper character and any spaces.

/*
 * LOCAL VARIABLES
 * 
 * !WARNING!
 * These path values have to be initiated everytime any of the nemo_functions are used.
 */
var abs_doc_path;           // current document path (file://URL), corresponds with dw API: docPathURL (dw.getDocumentDOM().URL)
var abs_folder_path;        // current folder path (file://URL), acquired from 'abs_doc_path'
var abs_root_path;          // current topic (NL => module) folder path (default: file:///C:/...), corresponds with dw API: siteRootURL
var abs_dest_path;          // destination folder path (default: file:///C:/.../delimiter_folder_nemo) points to a default nemo location.
var abs_animations_path;    // destination folder path (default: file:///C:/.../delimiter_folder_nemo/animations) points to a default nemo location.
var abs_images_path;        // destination folder path (default: file:///C:/.../delimiter_folder_nemo/images) points to a default nemo location.

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
     */
    abs_root_path = nemo_getParentFolderPath(abs_folder_path);
    abs_dest_path = abs_root_path + delimiter_folder_nemo;
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

/*
 * FILE
 * 
 * functions with focus on files
 */

/**
 * Function that copies files from a source file to the destination folder.
 * The destination folder is a global variable (abs_images_path).
 * If one chooses ignoring the upcoming files, it will only ignore the already existing files.
 * 
 * @param {string} src_folder - a valid source URI (file://URL).
 * @param {string} folder_str_name - context name for confirmation pop-up
 * @returns {boolean} True for succes, False for failure. 
 */
function nemo_copyFiles(src_folder, folder_str_name) {
    var isSucces = false;

    if (folder_str_name == null) {
        folder_name = "given"; 
    } else {
        folder_name = folder_str_name;
    }
    
    var list_files = DWfile.listFolder(src_folder, "files");
    if (list_files.length) {
        var doTheSame = false;
        var didAnOverride = false;

        for (var j = 0; j < list_files.length; j++) {
            var dest_file = dw.doURLEncoding(abs_images_path + delimiter_path + list_files[j]);
            var src_file = dw.doURLEncoding(src_folder + delimiter_path + list_files[j]);
            
            if (DWfile.exists(dest_file)) {
                if (!doTheSame) {
                    didAnOverride = confirm("The file " + list_files[j] + " already exists in your " + folder_name +" directory.\nWould you like to override the file?");
                    doTheSame = confirm("Do you want to " + (didAnOverride ? "override" : "ignore") + " all upcoming files?");
                }

                if (doTheSame && didAnOverride) {
                    isSucces = DWfile.copy(src_file, dest_file);
                }
            } else {
                isSucces = DWfile.copy(src_file, dest_file);
            }
        }
    }
    return isSucces;
    /* var list_img = DWfile.listFolder(edge_animation.path.abs + folder_image);
    if (list_img) {
        var doTheSame = false;
        var didAnOverride = false;

        for (var j = 0; j < list_img.length; j++) {
            var dest_file_img = abs_images_path + delimiter_path + list_img[j];
            
            if (DWfile.exists(dest_file_img)) {
                if (!doTheSame) {
                    didAnOverride = confirm("The image " + list_img[j] + " already exists in your images directory.\nWould you like to override the file?");
                    doTheSame = confirm("Do you want to " + (didAnOverride ? "override" : "ignore") + " all upcoming files?");
                }

                if (doTheSame && didAnOverride) {
                    DWfile.copy(edge_animation + folder_image + delimiter_path + list_img[j], dest_file_img);
                }
            } else {
                DWfile.copy(edge_animation + folder_image + delimiter_path + list_img[j], dest_file_img);
            }
        }
    } */
}

/*
 * FOLDER
 * 
 * functions with focus on folders
 */

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

/*
 * SLIDES
 * 
 * functions with focus on (nemo)slides.
 */

/**
 * get the SlideNodes from the DOM.
 * @param {HTMLElement} [dom = dw.getDocumentDOM()] - the document DOM
 * @returns {Object} list with slide nodes.
 */
function nemo_getSlideNodes(dom) {
    var dom_temp;
    if (dom == null) {
        dom_temp = dw.getDocumentDOM();
    } else {
        dom_temp = dom;
    }
    var slides = [];
    if (dom_temp !== null) {
        var sw = dom_temp.getElementById(str_slideswrapper);
        if (sw !== undefined) {
            slides = sw.childNodes;
            slides.shift(); // remove slide stay wrapperc
        }
    }
    return slides;
}

/**
 * Get the current slide from the DOM.
 * @param {HTMLElement} [dom = dw.getDocumentDOM()] - the document DOM
 * @returns {HTMLElement | number} Current Slide Node or -1. 
 */
function nemo_getCurrentSlide(dom) {
    var dom_temp;
    if (dom == null) {
        dom_temp = dw.getDocumentDOM();
    } else {
        dom_temp = dom;
    }

    var i = -1;
    var slides = nemo_getSlideNodes(dom_temp);

    if (slides !== undefined) {
        for (var j = 0; j < slides.length; j++) {
            var isactive = false;
            var classlist = slides[j].class && slides[j].class.split(" ");
            isactive = classlist && nemo_contains(classlist, "active");

            if (isactive) {
                i = slides[j];
                //break;
            }
        }
    }

    return i;
}

/**
 * Get the Stage or Slide width.
 * @param {HTMLElement} [dom = dw.getDocumentDOM()] - the document DOM
 * @returns {number} the stage/slide width
 */
function nemo_getStageWidth(dom) {
    var dom_temp;
    if (dom == null) {
        dom_temp = dw.getDocumentDOM();
    } else {
        dom_temp = dom;
    }
    var width = -1;
    var slideNode = nemo_getCurrentSlide(dom_temp);
    width = slideNode && slideNode.getComputedStyleProp("width");
    return width;
}

/**
 * Get the Stage or Slide height.
 * @param {HTMLElement} [dom = dw.getDocumentDOM()] - the document DOM
 * @returns {number} the stage/slide height
 */
function nemo_getStageHeight(dom) {
    var dom_temp;
    if (dom == null) {
        dom_temp = dw.getDocumentDOM();
    } else {
        dom_temp = dom;
    }
    var width = -1;
    var slideNode = nemo_getCurrentSlide(dom_temp);
    width = slideNode && slideNode.getComputedStyleProp("height");
    return width;
}

/*
 * ANIMATION
 * 
 * functions with focus on (Edge)Animations.
 */

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
    } else if (REGEX_TRAILING_PUBLISHWEBIMG.test(folder_path)) {
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
    if (publish_path && DWfile.exists(publish_path)) {
        return publish_path;
    } else {
        alert("Published folder does not exist.\nPlease, make sure to selecht an (published) Edge Animation folder.\nOtherwise publish (Ctrl+Alt+S) your animation first.");
        return false;
    }     
}

/**
 * Simple function that checks if the selected element is an EdgeAnimation
 * div-container.
 * 
 * @param {HTMLElement} [dom = dw.getDocumentDOM()] - current document DOM
 * @returns {boolean} true or false 
 */
function nemo_isValidAnimeDiv(dom) {
    var dom_temp;
    if (dom == null) {
        dom_temp = dw.getDocumentDOM();
    } else {
        dom_temp = dom;
    }

	var the_node = dom_temp.getSelectedNode();s
	if(REGEX_ATTR_CLASS.test(the_node.class)) {
		return true;
	} else {
		return false;
	}
}

/**
 * Checks if there exists an unique Edge Animation file in the <tt>folderPath</tt>.
 * 
 * @param {string} folder_path 
 * @returns {(string | boolean)} filename or false.
 */
function nemo_getAnimeName(folder_path) {
    var file_list = DWfile.listFolder(folder_path, "files");
    var error_or_filename = false;
    
    if (file_list.length) {
        
        var numValidEdgeAnime = 0;

        for (var i = 0; i < file_list.length; i++) {
            
            var element_string = file_list[i];
            
            if (REGEX_TRAILING_EDGEFILE.test(element_string)) {
                numValidEdgeAnime++;
                error_or_filename = element_string;
            }
        }

        if (numValidEdgeAnime === 0) {

            error_or_filename = "There does not exist a correct Edge Animation file.\nMake sure to select an Edge Animation Folder,\nor publish (Ctrl+Alt+S) your edge animation first.";
        } else if (numValidEdgeAnime === 1) {

            return nemo_getStringSliceUpTo(error_or_filename, delimiter_file_edge);
        } else {

            error_or_filename = "There does not exist an unique Edge Animation file.\nMake sure to save an Edge Animation in it's own folder.";
        }
    } else {
        error_or_filename = "There are not even files present in this folder...,\nMake sure to select an Edge Animation Folder,\nor publish (Ctrl+Alt+S) your edge animation first.";
    }

    if (error_or_filename) {
        alert(error_or_filename);
    }
    
    return false;
}

/**
 * Returns if one of the files is modified, but has as extra option that it removes the destination file.
 * This removal occurs only when it is the argument is given, valid (URI) and modified. 
 * 
 * @param {string} modification_dest - modification date of the destination file
 * @param {string} modification_src - modification date of the source file
 * @param {string} [path_dest_file = undefined] - an URI of the destination file
 * @returns {boolean} is modified or not.
 */
function nemo_isModified(modification_dest, modification_src, path_dest_file) {
    var error = false;

    if (modification_dest === modification_src) {
        alert("Animation up-to-date.\nIf changes were made, please re-publish (Ctrl + Shift + S) your animation first.");
        return false;
    } else if (path_dest_file == null) {
        alert("Updated to a newer version, if no errors occur!");
        return true;
    } else {
        alert("Updated an older version, if no errors occur!");
        DWfile.remove(path_dest_file);
        return true;
    }
}

/**
 * A function that imports all the files from the published folder to the destination folder.
 * It handles copying and writing.
 * 
 * @param {Object} edge_animation - EdgeAnimation object.
 * @param {string} source_text - the read file contents (i.e. text)
 * @returns {boolean} True for succes, False for failure. 
 */
function nemo_importEdgeFiles(edge_animation, source_text) {
    var error = false;

    if (!DWfile.exists(abs_animations_path)) DWfile.createFolder(abs_animations_path);
    if (!DWfile.exists(abs_images_path)) DWfile.createFolder(abs_images_path);

    if (DWfile.exists(edge_animation.path.destfile)) {
        var list_str_modate = REGEX_ATTR_MODIFICATION.exec(DWfile.read(edge_animation.path.destfile));

        if (list_str_modate == null) {
            alert('ERROR: Destination file already exists, but does not contain modification date');
            error = true;
        } else {
            error = !nemo_isModified(nemo_getStringTrailing(list_str_modate[0], modification_str_date), edge_animation.attributes.modidate, edge_animation.path.destfile);
        }
    } else {
        DWfile.createFolder(edge_animation.path.dest);  
    }

    if (error) {
        return false;
    } else {
        var isSucces = nemo_copyFiles(edge_animation.path.abs + folder_image, folder_image);
        
        if (!isSucces){
            alert('ERROR: copying (image) files failed...');
        }
        /**
         * Modify Edge Animate file and write to dest_file.
         */
        var dest_text = edge_animation.modEdgeAnimationContent(source_text);
        if (dest_text && DWfile.write(dw.doURLEncoding(edge_animation.path.destfile), dest_text)) {
            return true;
        } else {
            alert("ERROR: Failed to import animation. Could not write to edge file.");
            return false;
        }
    }
}

/**
 * Simple function that inserts a (div) tag in the DOM.
 * 
 * @param {string} divTag - div tag, whole container
 * @param {string} divID - div container id
 * @returns {boolean} True for succes, false for Failure. 
 */
function nemo_insertTag(divTag, divID) {
    var dom = dw.getDocumentDOM();
    var activeSlide = nemo_getCurrentSlide(dom);

    if (activeSlide != -1) {
        activeSlide.innerHTML = divTag + activeSlide.innerHTML;
        var node = dom.getElementById(divID);
        dom.setSelectedNode(node, true, true);
        return true;
    } else {
        alert("Could not find the active slide. Please select a slide first.");
        return false;
    }
}

/**
 * Deletes the EdgeActions of a specific animation from the current DOM.
 * 
 * @param {regex} REGEX_NAME - an valid RegEx.
 * @param {HTMLElement} dom - current Document DOM 
 */
function nemo_delEdgeActions(REGEX_NAME, dom) {
    var dom_temp;
    if (dom == null) {
        dom_temp = dw.getDocumentDOM();
    } else {
        dom_temp = dom;
    }

    var div_element = dom_temp.getElementById(class_animation + delimiter_id_name + edge_animation.name.file);  
    var script_element = dom_temp.getElementById(id_edge_actions);

    if(div_element !== undefined && confirm("Would you also remove the animation container from the stage?")) {
        div_element.outerHTML = ''; // remove div element, .getElementById("my-element").remove(); or .getElementsByClassName("my-elements").remove();
    } else if(node_element !== undefined) {
        if(node_element.getAttribute('id')) node_element.removeAttribute('id');
        node_element.setAttribute('class', ANIMATIONCLASS);
        if(node_element.getAttribute('data-name')) node_element.removeAttribute('data-name');
    }

    if (script_element) {
        var script = script_element.innerHTML;
        var dom_actions;
        var new_actions;

        // Make the functions description runnable
        if(script !== undefined) eval(script);
        if(typeof EdgeAnimationActions === 'function') {
            dom_actions = EdgeAnimationActions();
        }

        if (dom_actions) {
            new_actions = dom_actions;
            var removeActions = false;
            var didIAsked = false;

            for(var key in dom_actions) {
                var list_element = dom_actions[key].element;
                
                if(list_element && list_element.length > 0) {
                    
                    for(var i=0; i < list_element.length; i++) {
                        var str = list_element[i];
                        var checkAction = REGEX_NAME.test(str);
                        
                        if(checkAction && !removeActions && !didIAsked) {
                            if(confirm("Some actions are found in Edge Actions. Would you like to remove these? Yes is recommended.")) {
                                removeActions = true;
                            }
                            didIAsked = true;
                        }

                        // Remove this action, if the user would like so
                        if(removeActions && checkAction) {
                            var theelement = dom_actions[key].element;
                            var thetargets = dom_actions[key].targets;
                            var theactions = dom_actions[key].actions;

                            theelement = arraySplice(theelement, i, 1);
                            thetarget = arraySplice(thetargets, i, 1);
                            theactions = arraySplice(theactions, i, 1);

                            new_actions[key].element = theelement;
                            new_actions[key].targets = thetargets;
                            new_actions[key].actions = theactions;
                        }
                    }
                }
            }

            if(removeActions) {
                var content = 'function EdgeAnimationActions() { var actions = ' + JSON.stringify(new_actions) + '; return actions;}';
                script_element.innerHTML = content;
            }
        }
    }
}

/**
 * Function that makes a list of EdgeAnimation objects based on the contents
 * it gets from the <tt>abs_animations_path</tt> folder.
 * 
 * @returns {Object} A list of EdgeAnimation objects or an empty list.
 */
function nemo_getEdgeAnimations() {
    var list_animations = [];
    var list_folder = DWfile.listFolder(abs_animations_path, 'directories');

    if (list_folder.length){
        
        // Check all the found folders containing an animation.
        for (var i = 0; i < list_folder.length; i++) {
            var source_text = false;
            var edge_animation = new EdgeAnimation();
            var list_files = DWfile.listFolder(abs_animations_path + delimiter_path + list_folder[i], 'files');
            
            var numValidEdgeAnime = 0;
            var error_or_filename = false;

            // Check if there exists an _edge.js file
            for (var j = 0; j < list_files.length; j++) {
                var element_string = file_list[j];

                if (REGEX_TRAILING_EDGEFILE.test(element_string)) {
                    numValidEdgeAnime++;
                    error_or_filename = element_string;
                }
            }

            if (numValidEdgeAnime === 0) {
                error_or_filename = "ERROR: The animations folder: " + list_folder[i] + " does not contain any animation file.";
            } else if (numValidEdgeAnime === 1) {
                source_text = DWfile.read(abs_animations_path + delimiter_path + list_folder[i] + delimiter_path + error_or_filename);
                
                // Done the avoind showing the error when succesfull.
                error_or_filename = !edge_animation.initFromEdgeFile(source_text, error_or_filename);

                list_animations.push(edge_animation);
            } else {
                error_or_filename = "ERROR: The animations folder: " + list_folder[i] + " contains more then one animation file."
            }

            // Handle the errors.
            if (error_or_filename) {
                alert(error_or_filename);
            }
        }
        
        //
        return list_animations;
    } else {
        // No animation folders present.
        return list_animations;
    }
}

/**
 * This function is called as first when no animations exist. It
 * adds an animation in the sense of adding to multiple parts:
 * - Creates an EdgeAnimation object,
 * - Gets all properties,
 * - Imports Files,
 * - Inserts Tag.
 * 
 * @returns {Object | boolean} EdgeAnimation object or false.
 */
function nemo_addEdgeAnimation() {
    // NOTICE: make sure nemo_initPaths() is called before calling any of these functions!
    // NOTICE: make sure it is called uniquely per task, otherwise there is crosstalk between tabs/documents/files.
    
    var edge_animation = new EdgeAnimation();
    var dom = dw.getDocumentDOM();

    /**
     * use of short-circuiting to write everything in a short way.
     * 
     * (1) If it could init folder and file paths function continues process, else return false.
     * 
     * (2)      If the destination file already exists, it will continue this (sub)process (updating an older animation),
     *          
     * (3)              If it is modification dates are the same return false,
     *                  else copy new-files,
     * 
     *          else it will continue the normal process of modifying and copying and return true
     */

    // (1) initiate all paths and name of the file
    var isAdded = edge_animation.initFromFolderPath();
     
    // (2) read the source file, get and set default attribute values.
    var source_text = isAdded && DWfile.read(edge_animation.path.srcfile);
    isAdded = isAdded && edge_animation.setDefaultAttributes(source_text);

    // (3) import all files, copying images, modifying and write publish edge file.
    isAdded = isAdded && nemo_importEdgeFiles(edge_animation, source_text);

    // (4) insert tag.... or change tag.
    if (nemo_isValidAnimeDiv(dom)) {
        isAdded = isAdded && nemo_changeEdgeAnimation(edge_animation, dom);
    } else {
        isAdded = isAdded && nemo_insertTag(edge_animation.getDivTag(), edge_animation.attributes.id);
    }  

    // If all steps went well it returns an EdgeAnimation object.
    return (isAdded ? edge_animation : isAdded);
}

/**
 * Changes/assigns the div-container information, such that another animation
 * is played from this div.
 * It does not check if is a valid EdgeAnimation container, this is done by the
 * canInspectSelection (in the inspector) or by nemo_addEdgeAnimation().
 * 
 * @param {EdgeAnimation} edge_animation - EdgeAnimation object 
 * @param {HTMLElement} [dom = dw.getDocumentDOM()] - current document DOM
 * @returns {boolean} true for succes, false for failure.
 */
function nemo_changeEdgeAnimation(edge_animation, dom) {
    var dom_temp;

    if (dom == null) {
        dom_temp = dw.getDocumentDOM();
    } else {
        dom_temp = dom;
    }

    if (edge_animation instanceof EdgeAnimation) {
        var the_node = dom_temp.getSelectedNode();

        the_node.setAttribute('id', edge_animation.attributes.id);
        the_node.setAttribute('class', class_animation + delimiter_class_space + edge_animation.attributes.compclass);
        the_node.setAttribute('height', edge_animation.attributes.height + 'px');
        the_node.setAttribute('width', edge_animation.attributes.width + 'px');
        the_node.setAttribute('data-name', edge_animation.name.file);

        return true;
    } else {
        alert('Unexpected ERROR: not an instance of EdgeAnimation');
        return false;
    }
}

/**
 * Deletes the animation files based on the info that is 
 * contained in the EdgeAnimation object, which is passed as argument.
 * 
 * @param {Object} edge_animation - EdgeAnimation object 
 */
function nemo_delEdgeAnimation(edge_animation) {
    if (edge_animation instanceof EdgeAnimation) {
        // Confirmation for deletion/removal is done in a higher level function.
        
        // (1) Check folder existence and delete.
        var isSucces = DWfile.exists(edge_animation.path.dest) && DWfile.remove(edge_animations.path.dest);

        // (2) Check for EdgeActions and remove actions and optionally the div-container
        nemo_delEdgeActions(new RegExp('\\b' + edge_animation.name.file + '\\b'));

        if (!isSucces) alert('Unexpected ERROR: animation folder does not exist anymore or removal failed.');

        return isSucces;
    } else {
        alert('ERROR: the object that has to be deleted/removed is not an EdgeAnimation object.');
        return false;
    }
}

/**
 * Edge Animation object, which contains and can extract/create information on an animation.
 * @name EdgeAnimation
 * @class
 * @constructor
 */
var EdgeAnimation = (function () {
    /* "use strict"; */

    /**
     * @alias EdgeAnimation
     */
    var EdgeAnimation = function () {
        this.name = {
            "folder": "",
            "file":   ""
        }
        this.attributes = {
            "class":     class_animation,
            "id":        "",
            "compclass": "",
            "width":     "",
            "height":    "",
            "modidate":  ""
        };
        this.path = {
            "abs":      "",             // Absolute path to current source folder, ends uri without '/'. (.../this.name.folder/publish/web)
            "rel":      "",             // Relative path to source folder, ends uri without '/'. (.../this.name.folder/publish/web)
            "srcfile":  "",             // Absolute path to current source file, ends URI with '_edge.js'.
            "dest":     "",             // Absolute path to current destination folder. (.../animations/this.name.file)
            "destfile": ""              // Absolute path to current destination file. (.../animations/this.name.file/this.name.file_edge.js)
        };

        this.DOMid
    }

    /**
     * The first function that has to be called when object is created from reading an
     * EdgeAnimation-file. It sets file and folder names, with help of setCustomAttributes
     * it will also initiate the current paths.
     * 
     * @param {string} source_text - the file content string
     * @param {string} filename - the filename of an edge animation (which ends with _edge.js)
     * @returns {boolean} True for succes, false for failure.
     */
    EdgeAnimation.prototype.initFromEdgeFile = function (source_text, filename) {
        if (this.setCustomAttributes(source_text)) {
            this.name.folder = nemo_getStringTrailing(nemo_getStringSliceUpTo(this.path.abs, folder_publishweb), delimiter_path);
            this.name.file = nemo_getStringSliceUpTo(filename, delimiter_file_edge);

            this.path.srcfile = this.path.abs + delimiter_path + filename;
            this.path.dest = abs_animations_path + delimiter_path + this.name.file;
            this.path.destfile = this.path.dest + delimiter_path + filename;

            return true;
        } else {
            return false;
        }
    }

    /**
     * The first function that has to be called when an EdgeAnimation-file is added.
     * Asks for a folder containing an Edge Animation, if eligible it initiates basic animation file properties.
     * It does not read the contents yet, so it only checks shallow/trivial eligiblity. 
     * 
     * @return {boolean} True if succeeded, false if failed.
     */
    EdgeAnimation.prototype.initFromFolderPath = function () {
        // It is not first checked if it is a new animation, this is actually handled before actual copying in nemo_importEdgeFiles().
        var path = nemo_recurseTask("Are you sure to quit and not add an animation?", nemo_getFolderPathBrowse);
        if (path) {
            this.path.abs = nemo_isValidAnimeFolder(path);
        } else{
            // do nothing, since the user canceled adding.
        }
        
        // if path was given and it is valid, then (only) proceed, return true here.
        // function to check if valid animationfolder.
        if (this.path.abs) {
            // Due to the workings of Edge Animate 5.0.1 and 6.0.0 the names of file and folder coincide, see a sample folder for this phenomenen.
            
            this.name.folder = nemo_getStringTrailing(path, delimiter_path);
            this.name.file = nemo_getAnimeName(this.path.abs);//stuck here i think.

            this.path.rel = dw.absoluteURLToDocRelative(abs_doc_path, abs_root_path, this.path.abs);
            this.path.srcfile = this.path.abs + delimiter_path + this.name.file + delimiter_file_edge;
            this.path.dest = abs_animations_path + delimiter_path + this.name.file;
            this.path.destfile = this.path.dest + delimiter_path + this.name.file + delimiter_file_edge;

            if (this.name.file) {
                return true;
            } else {
                return false;
            }
        } else {
            // return false and remove object... (or do nothing with it)
            return false;
        }
    };

    /**
     * Checks if the actual contents are eligible Adobe Edge Animation
     * and sets attribute values: composition class, width and height.
     * Used when EdgeAnimation object is initiated by adding new animation file.
     * 
     * @param {string} source_text - the read file contents (i.e. text)
     * @returns {boolean} true for succes or false for failure.
     */
    EdgeAnimation.prototype.setDefaultAttributes = function (source_text) {
        var error = false;
        var list_matches = source_text && source_text.match(REGEX_ATTR_COMPOSITIONCLASS);

        var version = source_text.match(REGEX_ATTR_VERSION_NUM);
        version = version && version[2];
        
        this.attributes.id = this.attributes.class + delimiter_id_name + this.name.file.replace(REGEX_CHANGE_SPECIAL, "");
        

        if (source_text == null) {
            error = 'could not retrieve any animation info; null.';
        } else if (source_text == false) {
            alert("ERROR: No source file content.");
            return false;
        } else if (!REGEX_ATTR_VERSION.test(source_text) || (version && version < 5)) {
            error = ':Animation is not supported.\nPlease update your animation to the 5.x.x version,\n(Adobe Edge Animate CC 2014.1 or higher).';
        } else if (list_matches == null || list_matches.length < 4) {
            // there could also be something wrong with the composition name.
            error = 'could not retrieve Adobe Edge Animation file content particulars,\ne.g. the composition class.';
        } else {

            this.attributes.compclass = list_matches[2];
            if (this.attributes.modidate === "") {
                this.attributes.modidate = DWfile.getModificationDate(this.path.srcfile);
            }

            // get and set sizes. Not the safest/best way of getting the information...
            source_text = source_text.match(REGEX_ATTR_OBJECT_STAGE);               // Get Stage Object
            source_text = source_text && source_text[0];
            source_text = source_text.match(REGEX_ATTR_OBJECT_R);                   // Get R Object
            source_text = source_text && source_text[0];

            var list_sizes = source_text && source_text.match(REGEX_ATTR_SIZES);    // Get sizes
            var list_length = list_sizes.length;
            if (list_sizes == null || list_length < 2) {
                error = "could not retrieve the animation's sizes.";
            } else {
                // This is suboptimal, since there is a border case with 6 values for 'rect' (R Object). 
                // Undocumented, but might have to do with "https://developer.mozilla.org/en-US/docs/Web/SVG/Element/rect"
                var end = list_sizes.length - 1;

                this.attributes.width = list_sizes[end - 1];
                this.attributes.height = list_sizes[end];

                return true
            }
        }

        if (error) {
            alert("ERROR: setDefaultAttributes " + error);
        }

        return false;
    };

    /**
     * Checks if the actual contents are eligible Adobe Edge Animation
     * and sets values: relative and absolute update path, modification date,
     * composition class, width and height.
     * Used when EdgeAnimation object is initiated by an existing animation file.
     * 
     * If we are going update inf into a JSON this is one of the functions that have to change.
     * 
     * @param {string} source_text - the read file contents (i.e. text)
     * @returns {boolean} true for succes or false for failure.
     */
    EdgeAnimation.prototype.setCustomAttributes = function (source_text) {
        // If JSON-way is implemented this whole functions is deprecated, since the animation files are not modified anymore.
        if (source_text == null) {
            alert("ERROR: setCustomAttributes encountered unexpected error; undefined input");
            return false;
        } else if (source_text == false) {
            alert("ERROR: No source file content.");
            return false;
        } else {
            var list_str_update = REGEX_ATTR_UPDATE.exec(source_text);
            var list_str_modate = REGEX_ATTR_MODIFICATION.exec(source_text);

            if (list_str_update == null || list_str_modate == null) {
                alert("ERROR: setCustomAttributes, this file seems to be unedited by Nemo for Dreamweaver.\nCould unexpectedly not find updatePath or modificationDate.");

                return false;
            } else {
                this.path.rel = nemo_getStringTrailing(list_str_update[0], modification_str_update_path);
                this.path.abs = dw.relativeToAbsoluteURL(abs_doc_path, abs_folder_path, this.path.rel);
                this.attributes.modidate = nemo_getStringTrailing(list_str_modate[0], modification_str_date);

                return this.setDefaultAttributes(source_text);
            }
        }
    };

    /**
     * Retrieves Edge Animation div-tag from the object.
     * A problem might be the uniqueness of div-tag...
     * 
     * @returns {string} An animation specific div-tag.
     */
    EdgeAnimation.prototype.getDivTag = function () {
        var top = 260;
        var left = 340; // 500 is default width
        var uniqueId = this.attributes.id;
        // New way for class should be: "class_animation", but nemo-engine does not support that yet... ("compclass + ' ' + class_animation")
        var divTag = '<div class="' + class_animation + delimiter_class_space + this.attributes.compclass 
                   + '" id="' + uniqueId 
                   +'" style="position: absolute; top: ' + top 
                   + 'px; left: ' + left 
                   + 'px; width: ' + this.attributes.width 
                   + 'px; height: ' + this.attributes.height 
                   + 'px;" data-name="' + this.name.file 
                   + '" data-compositionclass="' + this.attributes.compclass 
                   + '"><' + '/div>';
        return divTag;
    };

    /**
     * Modifies the Edge Animation content: modifies the path to images
     * and adds updatePath and modificationDate.
     * Usage after setting attributes is mandatory. 
     * 
     * If we are going update inf into a JSON this is one of the functions that have to change.
     * @param {string} source_text - the read file contents (i.e. text)
     * @returns {string | boolean} A string containing the modified file contents or false.
     */
    EdgeAnimation.prototype.modEdgeAnimationContent = function (source_text) {
        if (source_text == null) {
            alert('Unexpected Error inside modifyAnimationFile');
            return false;
        } else if (source_text == false) {
            return false;
        } else {
            // The published _edge.js files have an empty first line, that is why adding comments in the file does not affect the functioning.
            var text_additional = modification_str_stamp
                + modification_str_update_path + this.path.rel + delimiter_modification
                + modification_str_date + this.attributes.modidate + delimiter_modification;

            var text_modified = text_additional + source_text;
            text_modified = text_modified.replace(REGEX_CHANGE_IMG_LOC, folder_change_img);
            text_modified = text_modified.replace(REGEX_CHANGE_SCRIPTS, file_change_script);

            return text_modified;
        }
    };

    return EdgeAnimation;
})();