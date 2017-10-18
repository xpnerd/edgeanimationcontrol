var REGEX_EDGEFILE = /\_edge\.js/;

/**
 * Checks if there exists an unique Edge Animation file in the <tt>folderPath</tt>.
 * 
 * @param {string} folderpath 
 * @returns {(string | boolean)} If file exists returns string, else return false.
 */
function nemo_getAnimeName(folderpath) {
    var file_list = DWfile.listFolder(folderPath, "files");
    var error = false;

    if (list) {
        
        var numValidEdgeAnime = 0;

        for (var i = 0; i < list.length; i++) {
            
            var element = list[i];
            
            if (element.test(REGEX_EDGEFILE)) {numValidEdgeAnime++}
        }

        if (numValidEdgeAnime === 0) {

            error = "There does not exist a correct Edge Animation file.\nMake sure to select an Edge Animation Folder,\nor publish (Ctrl+Alt+S) your edge animation first.";
        } else if (numValidEdgeAnime === 1) {

            return element.slice(0, element.lastIndexOf("_"));
        } else {

            error = "There does not exist an unique Edge Animation file.\nMake sure to save an Edge Animation in it's own folder.";
        }
    }

    if (error) {
        alert(error);
    }
    
    return false;
}