var str_slideswrapper = "slideswrapper";
var delimiter_file_edge = "\_edge.js";

var REGEX_TRAILING_EDGEFILE = /\_edge\.js/;
var class_animation = "EdgeAnimation";

/**
 * Checks if there exists an unique Edge Animation file in the <tt>folderPath</tt>.
 * 
 * @param {string} folderpath 
 * @returns {(string | boolean)} filename or false.
 */
function nemo_getAnimeName(folderpath) {
    var file_list = dw.listFolder();
    //var file_list = DWfile.listFolder(folderPath, "files"); //check the typeof the output...
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

    var list_files = DWfile.listFolder(src_folder);
    if (list_files) {
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
    return isSucces
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

/**
 * Slide particulars, already existing, but modified
 */

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