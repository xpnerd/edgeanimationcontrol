var folder_change_img = "var im='images/'";
var file_change_script = "scripts=\[\]";
var delimiter_modification = "*";
var modification_str_stamp = " \/* Edited by Nemo *\/ ";
var modification_str_update_path = "\/\/updatePath:";
var modification_str_date = "\/\/modificationDate:";

//var REGEX_TRAILING = /[^\/]*$/;                 // everything after the last '/'
var REGEX_ATTR_COMPOSITIONCLASS = /AdobeEdge,('|")([^'"]+)('|")/;
var REGEX_ATTR_OBJECT_STAGE = /\'\${Stage}\'[\s\S]*?\}/g;
var REGEX_ATTR_OBJECT_R = /(r:)[\s]{0,}\[[\s\S]*?\]/g;
var REGEX_ATTR_SIZES = /[0-9]{3,4}/g;
var REGEX_ATTR_VERSION = /vid\=/; // should maybe not be escaped...
var REGEX_ATTR_UPDATE = new RegExp(modification_str_update_path + "[^" + delimiter_modification + "]*"); // /\/\/updatePath:[^*]*/;
var REGEX_ATTR_MODIFICATION = new RegExp(modification_str_date + "[^" + delimiter_modification + "]*");  //, /\/\/modificationDate:[^*]*/;
var REGEX_CHANGE_IMG_LOC = /(var im=')[\S\s]*?'/g;
var REGEX_CHANGE_SCRIPTS = /scripts=\[[^\]]*\]/;
var REGEX_CHANGE_SPECIAL = /^[_\d]*| /g; //remove any digits and underscores in front of the first proper character. And any spaces.

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
        alert("Animation up-to-date.\n If changes were made, please re-publish (Ctrl + Shift + S) your animation first.");
        return false;
    } else if (path_dest_file == null) {
        alert("Updated an older version, if no errors occur!");
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
function nemo_importFiles(edge_animation, source_text) {
    var error = false;

    if (!DWfile.exists(abs_dest_path + folder_anime)) DWfile.createFolder(abs_dest_path + folder_anime);
    if (!DWfile.exists(abs_dest_path + folder_image)) DWfile.createFolder(abs_dest_path + folder_image);

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
        nemo_copyFiles(edge_animation.path.abs + folder_image, folder_image);
        
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
 * This function is called as first when no animations exist. It
 * adds an animation in the sense of adding to multiple parts:
 * - Creates an EdgeAnimation object,
 * - Gets all properties,
 * - Imports Files,
 * - Inserts Tag.
 * 
 * @returns {object | boolean} EdgeAnimation object or false.
 */
function nemo_addEdgeAnimation() {
    nemo_initPaths();
    var error = false;
    var edge_animation = new EdgeAnimation();

    /**
     * use of short-circuiting to write everything in a short way.
     * 
     * (1) If it could init folder and file paths function continues process, else return false.
     * 
     * (2)     If the destination file already exists, it will continue this (sub)process (updating an older animation),
     *          
     * (3)             If it is modification dates are the same return false,
     *              else copy new-files,
     * 
     *      else it will continue the normal process of modifying and copying and return true
     */

    // (1) initiate all paths and name of the file
    isAdded = edge_animation.initFromFolderPath();

    // (2) read the source file, get and set default attribute values.
    var source_text = isAdded && DWfile.read(edge_animation.path.srcfile);
    isAdded = isAdded && edge_animation.setDefaultAttributes(source_text);

    // (3) import all files, copying images, modifying and write publish edge file.
    isAdded = isAdded && nemo_importFiles(edge_animation, source_text);

    // (4) insert tag....
    isAdded = isAdded && nemo_insertTag(edge_animation.getDivTag(), edge_animation.attributes.id);

    // If all steps went well it returns an EdgeAnimation object.
    return (isAdded ? edge_animation : isAdded);
}

/**
 * Edge Animation object.
 */
var EdgeAnimation = (function () {
    /* "use strict"; */

    var EdgeAnimation = function () {
        this.name = {
            "folder": "",
            "file": ""
        }
        this.attributes = {
            "class": class_animation,
            "id" : "",
            "compclass": "",
            "width": "",
            "height": "",
            "modidate": ""
        };
        this.path = {
            "abs": "",             // Absolute path to source folder, ends uri without '/'.
            "rel": "",             // Relative path to source folder, ends uri without '/'.
            "srcfile": "",
            "dest": "",
            "destfile": ""
        };

        this.DOMid
    }

    /**
    * initFromDOMNode initializes the EdgeAnimation object based on the 
    * information specified in 
    * @param  {[type]} EdgeAnimationDOMNode [description]
    * @return {[type]}                      [description]
    */
    EdgeAnimation.prototype.initFromDOMNode = function (EdgeAnimationDOMNode) {

    };

    /* EdgeAnimation.prototype.initFromFilePath = function () {

    }; */

    /**
     * The first function that has to be called when an EdgeAnimation-file is added.
     * Asks for a folder containing an Edge Animation, if eligible it initiates basic animation file properties.
     * It does not read the contents yet, so it only checks shallow/trivial eligiblity. 
     * 
     * @return {boolean} True if succeeded, false if failed.
     */
    EdgeAnimation.prototype.initFromFolderPath = function () {
        // first check if this is actually a new animation!
        var path = nemo_recurseTask("Are you sure to not add an animation?", nemo_getParentFolderPathBrowse);
        this.path.abs = nemo_isValidAnimeFolder(path);

        // if path was given and it is valid, then (only) proceed, return true here.
        // function to check if valid animationfolder.
        if (this.path.abs) {
            // Due to the workings of Edge Animate 5.0.1 and 6.0.0 the names of file and folder coincide, see a sample folder for this phenomenen.
            this.name.folder = nemo_getStringTrailing(path, delimiter_path);
            this.name.file = nemo_getAnimeName(this.path.abs);

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
        this.attributes.id = this.attributes.class + "_" + this.name.file.replace(REGEX_CHANGE_SPECIAL, "");
        if (source_text == null) {
            error = 'could not retrieve the animation size.';
        } else if (source_text == false) {
            return false;
        } else if (!REGEX_ATTR_VERSION.test(source_text)) {
            error = ':Animation is not supported.\nPlease update your animation to the 5.x.x version,\n(Adobe Edge Animate CC 2014 or higher).';
        } else if (list_matches == null || list_matches.length > 3) {
            // there could also be something wrong with the composition name.
            error = 'could not retrieve Adobe Edge Animation file content particulars,\ne.g. the composition class.';
        } else {

            this.attributes.compclass = list_matches[2];
            if (this.attributes.modidate === "") {
                this.attributes.modidate = DWfile.getModificationDate(this.path.srcfile);
            }

            // get and set sizes.
            source_text = source_text.match(REGEX_ATTR_OBJECT_STAGE); // Get Stage Object
            source_text = source_text && source_text[0];
            source_text = source_text.match(REGEX_ATTR_OBJECT_R); // Get R Object
            source_text = source_text && source_text[0];

            var list_sizes = source_text && source_text.match(REGEX_ATTR_SIZES); // Get sizes

            if (list_sizes == null || list_sizes.length < 2) {
                error = "could not retrieve the animation's sizes";
            } else {
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
        // OLD WAY for class attribute: "compclass + ' ' + class_animation"
        var divTag = '<div class="' + class_animation 
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
            // The published _edge.js files have an empty first line, that is why adding comments does not affect the functioning.
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