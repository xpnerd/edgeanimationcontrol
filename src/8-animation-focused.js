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
        publish_path = folder_path + FOLDER_WEB;
    } else if (REGEX_TRAILING_PUBLISHWEBIMG.test(folder_path)) {
        // it is a "ANIMATION/publish/web/images" path
        publish_path = nemo_getStringSliceUpTo(folder_path, DELIMITER_PATH);
    } else if (REGEX_TRAILING_IMG.test(folder_path) || REGEX_TRAILING_INCLUDES.test(folder_path)) {
        // it is a "ANIMATION/images" or "ANIMATION/edge_includes" path
        publish_path = nemo_getStringSliceUpTo(folder_path, DELIMITER_PATH) + FOLDER_PUBLISHWEB;
    } else {
        publish_path = folder_path + FOLDER_PUBLISHWEB;
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

	var the_node = dom_temp.getSelectedNode();
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

            return nemo_getStringSliceUpTo(error_or_filename, DELIMITER_FILE_EDGE);
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
        alert("Animation is NOT up-to-date.");
        return true;
    } else {
        alert("Updated an older version, if no errors occur!");
        DWfile.remove(path_dest_file);
        return true;
    }
}

/**
 * A function that imports all the files from the published folder to the destination folder.
 * It handles copying and writing, it is thus also handling updating of an EdgeAnimation.
 * 
 * @param {Object} edge_animation - EdgeAnimation object.
 * @param {string} [text = DWfile.read(edge_animation.path.srcfile)] - the read file contents (i.e. text)
 * @returns {boolean} True for succes, False for failure. 
 */
function nemo_importEdgeFiles(edge_animation, text) {
    var error = false;
    var isModified = false;

    if (text == null) {
        source_text = DWfile.read(edge_animation.path.srcfile);
        
        if (!source_text){
            alert("Unexpected ERROR: when updating we could not get any source contents.");
            return false;
        }
    } else {
        source_text = text;
    }

    if (!DWfile.exists(ABS_ANIMATIONS_PATH)) DWfile.createFolder(ABS_ANIMATIONS_PATH);
    if (!DWfile.exists(ABS_IMAGES_PATH)) DWfile.createFolder(ABS_IMAGES_PATH);

    if (DWfile.exists(edge_animation.path.destfile)) {
        var list_str_modate = REGEX_ATTR_MODIFICATION.exec(DWfile.read(edge_animation.path.destfile));

        if (list_str_modate == null) {
            alert('ERROR: Destination ' + edge_animation.name.file + ' file already exists, but does not contain modification date');
            error = true;
        } else {
            isModified = nemo_isModified(nemo_getStringTrailing(list_str_modate[0], MODIFICATION_STR_DATE), edge_animation.attributes.modidate, edge_animation.path.destfile);
            error = !isModified;

            // We do it this, so when not modified importing also concludes with true.
            // However it does not copy stuff and can insert a div-container anyway...
            if (!isModified) return true;
        }
    } else {
        DWfile.createFolder(edge_animation.path.dest);  
    }

    if (error) {
        return false;
    } else {
        var isSucces = nemo_copyFiles(edge_animation.path.abs + FOLDER_IMAGE, FOLDER_IMAGE);
        
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
 * @param {string} file_name - an valid edge file name string.
 * @param {HTMLElement} dom - current Document DOM 
 */
function nemo_delEdgeActions(file_name, dom) {
    var REGEX_NAME = new RegExp('\\b' + file_name + '\\b');
    var dom_temp;
    if (dom == null) {
        dom_temp = dw.getDocumentDOM();
    } else {
        dom_temp = dom;
    }

    var div_element = dom_temp.getElementById(CLASS_ANIMATION + DELIMITER_ID_NAME + file_name);  
    var script_element = dom_temp.getElementById(ID_EDGE_ACTIONS);

    if(div_element !== undefined && confirm("Would you also remove the animation container from the stage?")) {
        div_element.outerHTML = ''; // remove div element, .getElementById("my-element").remove(); or .getElementsByClassName("my-elements").remove();
    } else if(div_element !== undefined) {
        if(div_element.getAttribute('id')) div_element.removeAttribute('id');
        div_element.setAttribute('class', CLASS_ANIMATION);
        if(div_element.getAttribute('data-name')) div_element.removeAttribute('data-name');
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
    var list_folder = DWfile.listFolder(ABS_ANIMATIONS_PATH, 'directories');

    if (list_folder.length){
        
        // Check all the found folders containing an animation.
        for (var i = 0; i < list_folder.length; i++) {
            var source_text = false;
            var edge_animation = new EdgeAnimation();
            var list_files = DWfile.listFolder(ABS_ANIMATIONS_PATH + DELIMITER_PATH + list_folder[i], 'files');
            
            var numValidEdgeAnime = 0;
            var error_or_filename = false;

            // Check if there exists an _edge.js file
            for (var j = 0; j < list_files.length; j++) {
                var element_string = list_files[j];

                if (REGEX_TRAILING_EDGEFILE.test(element_string)) {
                    numValidEdgeAnime++;
                    error_or_filename = element_string;
                }
            }

            if (numValidEdgeAnime === 0) {
                error_or_filename = "ERROR: The animations folder: " + list_folder[i] + " does not contain any animation file.";
            } else if (numValidEdgeAnime === 1) {
                source_text = DWfile.read(ABS_ANIMATIONS_PATH + DELIMITER_PATH + list_folder[i] + DELIMITER_PATH + error_or_filename);
                
                // Done the avoid showing the error when succesfull.
                if (edge_animation.initFromEdgeFile(source_text, error_or_filename)) {
                    error_or_filename = false;
                    list_animations.push(edge_animation);
                } else{
                    error_or_filename = "Initializing from an Edge Animation file, failed...";
                }
             
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
 * This updates the given <tt>edge_animation</tt>.
 * 
 * @param {Object} edge_animation - An EdgeAnimation object 
 * @returns {boolean} True for succes, false for failure.
 */
function nemo_updateEdgeAnimation(edge_animation) {
    var source_text = DWfile.read(edge_animation.path.srcfile);
    
    if (source_text) {
        return nemo_importEdgeFiles(edge_animation, source_text);
    } else {
        alert("Unexpected ERROR: updating failed, no source_text...");
    }
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
        the_node.setAttribute('class', CLASS_ANIMATION + DELIMITER_CLASS_SPACE + edge_animation.attributes.compclass);
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
        var isSucces = DWfile.exists(edge_animation.path.dest) && DWfile.remove(edge_animation.path.dest);

        // (2) Check for EdgeActions and remove actions and optionally the div-container
        nemo_delEdgeActions(edge_animation.name.file);

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
            "class":     CLASS_ANIMATION,
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
            this.name.folder = nemo_getStringTrailing(nemo_getStringSliceUpTo(this.path.abs, FOLDER_PUBLISHWEB), DELIMITER_PATH);
            this.name.file = nemo_getStringSliceUpTo(filename, DELIMITER_FILE_EDGE);
            
            this.attributes.id = this.attributes.class + DELIMITER_ID_NAME + this.name.file.replace(REGEX_CHANGE_SPECIAL, DELIMITER_ID_NAME);

            this.path.srcfile = this.path.abs + DELIMITER_PATH + filename;
            this.path.dest = ABS_ANIMATIONS_PATH + DELIMITER_PATH + this.name.file;
            this.path.destfile = this.path.dest + DELIMITER_PATH + filename;

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
            
            this.name.folder = nemo_getStringTrailing(path, DELIMITER_PATH);
            this.name.file = nemo_getAnimeName(this.path.abs);//stuck here i think.

            this.attributes.id = this.attributes.class + DELIMITER_ID_NAME + this.name.file.replace(REGEX_CHANGE_SPECIAL, DELIMITER_ID_NAME);

            this.path.rel = dw.absoluteURLToDocRelative(ABS_DOC_PATH, ABS_ROOT_PATH, this.path.abs);
            this.path.srcfile = this.path.abs + DELIMITER_PATH + this.name.file + DELIMITER_FILE_EDGE;
            this.path.dest = ABS_ANIMATIONS_PATH + DELIMITER_PATH + this.name.file;
            this.path.destfile = this.path.dest + DELIMITER_PATH + this.name.file + DELIMITER_FILE_EDGE;

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
                alert("ERROR: setCustomAttributes, this file seems to be unedited by Nemo for Dreamweaver.\nCould unexpectedly not find 'updatePath' or 'modificationDate'.");

                return false;
            } else {
                this.path.rel = nemo_getStringTrailing(list_str_update[0], MODIFICATION_STR_UPDATE_PATH);
                this.path.abs = dw.relativeToAbsoluteURL(ABS_DOC_PATH, ABS_FOLDER_PATH, this.path.rel);
                this.attributes.modidate = nemo_getStringTrailing(list_str_modate[0], MODIFICATION_STR_DATE);

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
        var divTag = '<div class="' + CLASS_ANIMATION + DELIMITER_CLASS_SPACE + this.attributes.compclass 
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
            var text_additional = MODIFICATION_STR_STAMP
                + MODIFICATION_STR_UPDATE_PATH + this.path.rel + DELIMITER_MODIFICATION
                + MODIFICATION_STR_DATE + this.attributes.modidate + DELIMITER_MODIFICATION;

            var text_modified = text_additional + source_text;
            text_modified = text_modified.replace(REGEX_CHANGE_IMG_LOC, FOLDER_CHANGE_IMG);
            text_modified = text_modified.replace(REGEX_CHANGE_SCRIPTS, FILE_CHANGE_SCRIPT);

            return text_modified;
        }
    };

    return EdgeAnimation;
})();