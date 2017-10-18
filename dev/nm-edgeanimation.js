var REGEX_TRAILING = /[^\/]*$/;                 // everything after the last '/'

/**
 * Edge Animation object.
 */
var EdgeAnimation = (function() {
    /* "use strict"; */
    
        var EdgeAnimation = function(){
            this.attrs = {
    
            };
            this.path = {
                "abs" : "",             // Ends path without '/'.
                "rel" : ""              // Ends path without '/'.
    
            };
            this.DOMid
        }
    
        /**
         * The first function that has to be called when an EdgeAnimation-file is added.
         * Asks for a folder containing an Edge Animation, if eligible it initiates basic animation file properties.
         * It does not read the contents yet, so it only checks shallow/trivial eligiblity. 
         * 
         * @return {boolean} True if succeeded, false if failed.
         */
        EdgeAnimation.prototype.initFromFilePath = function(){
            // first check if this is actually a new animation!

            this.path.abs = nemo_loopFolderPathBrowse('Are you sure that you not want to add an animation?');
            
            // if path was given and it is valid, then (only) proceed, return true here.
            // function to check if valid animationfolder.
            if (this.path.abs && nemo_isValidAnimeFolder(this.path.abs)) {
                
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
        }
    })();