//var REGEX_TRAILING = /[^\/]*$/;                 // everything after the last '/'
var REGEX_ATTR_COMPOSITIONCLASS = /AdobeEdge,('|")([^'"]+)('|")/;
var REGEX_ATTR_OBJECT_STAGE = /\'\${Stage}\'[\s\S]*?\}/g;
var REGEX_ATTR_OBJECT_R = /(r:)[\s]{0,}\[[\s\S]*?\]/g;
var REGEX_ATTR_SIZES = /[0-9]{3,4}/g;
var REGEX_ATTR_VERSION = /vid\=/; // should maybe not be escaped...

function nemo_getAttributes(file_path){
    var attrs = {

    };
}

function nemo_getDefaultAttributes(text) {
    
}

/**
 * Edge Animation object.
 */
var EdgeAnimation = (function() {
    /* "use strict"; */
    
        var EdgeAnimation = function(){
            this.name = {
                "folder" : "",
                "file" : ""
            }
            this.attributes = {
                "class" : class_animation,
                "compclass" : "",
                "width" : "",
                "height" : ""
            };
            this.path = {
                "abs" : "",             // Ends path without '/'.
                "rel" : "",             // Ends path without '/'.
            };
            
            this.DOMid
        }

        /**
        * initFromDOMNode initializes the EdgeAnimation object based on the 
        * information specified in 
        * @param  {[type]} EdgeAnimationDOMNode [description]
        * @return {[type]}                      [description]
        */
        EdgeAnimation.prototype.initFromDOMNode = function(EdgeAnimationDOMNode) {
    
        };

        EdgeAnimation.prototype.initFromFilePath = function(){

        };
    
        /**
         * The first function that has to be called when an EdgeAnimation-file is added.
         * Asks for a folder containing an Edge Animation, if eligible it initiates basic animation file properties.
         * It does not read the contents yet, so it only checks shallow/trivial eligiblity. 
         * 
         * @return {boolean} True if succeeded, false if failed.
         */
        EdgeAnimation.prototype.initFromFolderPath = function(){
            // first check if this is actually a new animation!
            var path = nemo_recurseTask("Are you sure to not add an animation?", nemo_getParentFolderPathBrowse);
            this.name.folder = nemo_getStringTrailing(path, delimiter_path);
            this.path.abs = nemo_isValidAnimeFolder(path);
            
            // if path was given and it is valid, then (only) proceed, return true here.
            // function to check if valid animationfolder.
            if (this.path.abs) {
                
                this.path.rel = dw.absoluteURLToDocRelative(abs_doc_path, abs_root_path, this.path.abs);
                
                this.name.folder = REGEX_TRAILING.exec(this.path.abs);
                this.name.file = nemo_getAnimeName(this.path.abs);

                if (this.name.file) {
                    // true go on with reading in file, getting width(?), checking version(?), 
                } else {
                    return false;
                }
                
                

                //if(!error) {
                    //             var sourcefile = DWfile.read(absoluteSourceURL);
                    //             if(!/vid=/.test(sourcefile)) {
                    //                 error = "Animation not supported. Please update your animation to the 5.x version (Adobe Edge Animate CC 2014).";
                    //             }
                    //         }

                /**
                 * Check if it is a new animation!
                 * Check if there exists a publish folder in the animation folder by checking if "*_edge.js"-file exists.
                 * We exploit the standard Edge Animate folder file structure.
                 * 
                 * Edge Animation interest structure: "edgeAnimFolderURL/publish/web/edgeAnimName_edge.js"
                 *
                 * Due to the workings of Edge Animate 5.0.1 and 6.0.0 the names of file and folder coincide, see a sample folder for this phenomenen.
                 */
    
                // return true
            } else {
    
                // return false and remove object... (or do nothing with it basically)
                return false;
            }
        };

        /**
         * Checks if the actual contents are eligible Adobe Edge Animation
         * and sets attribute values: composition class, width and height.
         * 
         * @param {string} file_text - the read file contents (i.e. text)
         * @returns {boolean} true for succes or false for failure.
         */
        EdgeAnimation.prototype.setDefaultAttributes = function(source_text) {
            /* theNode.setAttribute('class', compositionclass + ' ' + ANIMATIONCLASS);
            theNode.setAttribute('data-name', givenAnimation);
            theNode.setAttribute('data-compositionclass', compositionclass); */

            /* theNode.style.width = width + "px";
            theNode.style.height = height + "px"; */
            var error = false;
            var list_matches = source_text && file.match(REGEX_ATTR_COMPOSITIONCLASS);
            list_matches_stage = file;

            if (source_text == null) {
                error = 'could not retrieve the animation size.';
            } else if (!REGEX_ATTR_VERSION.test(source_text)) {
                error = ':Animation is not supported.\nPlease update your animation to the 5.x.x version,\n(Adobe Edge Animate CC 2014 or higher).';
            } else if (list_matches == null || list_matches.length > 3) {
                // there could also be something wrong with the composition name.
                error = 'could not retrieve Adobe Edge Animation file content particulars,\ne.g. the composition class.';
            } else {

                this.attributes.compclass = list_matches[2];

                source_text = source_text.match(REGEX_ATTR_OBJECT_STAGE); // Get Stage Object
                source_text = source_text && source_text[0];
                source_text = source_text.match(REGEX_ATTR_OBJECT_R); // Get R Object
                source_text = source_text && source_text[0];
                
                var list_sizes = source_text && source_text.match(REGEX_ATTR_SIZES); // Get sizes

                if (list_sizes == null || list_sizes.length < 2) {
                    error = "could not retrieve the animation's sizes";
                } else {
                     var end = list_sizes.length - 1;
                    
                    this.attributes.width = list_sizes[end-1];
                    this.attributes.height = list_sizes[end];
                    
                    return true
                }
            }
            
            if (error) {
                alert("ERROR: setDefaultAttributes " + error);
            }

            return false;
        };

        EdgeAnimation.prototype.modifyAnimationFile = function(source_text) {
            
        }
    })();