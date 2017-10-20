var delimiter_file_edge = "_edge.js";

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