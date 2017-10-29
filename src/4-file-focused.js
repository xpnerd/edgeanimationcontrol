/*
 * FILE
 * 
 * functions with focus on files
 */

/**
 * Returns the filename of the current document file.
 * @deprecated since version 2.2.0
 */
function nemo_getDocumentFileName() {
    var REGEX_FILENAME = /[^\\\/:*?"<>|\r\n]+$/;
    var documentpath = dw.getDocumentPath("document");
    if (!documentpath) return;
    return REGEX_FILENAME.exec(documentpath)[0];
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
    
    var list_files = DWfile.listFolder(src_folder, "files");
    if (list_files.length) {
        var doTheSame = false;
        var didAnOverride = false;

        for (var j = 0; j < list_files.length; j++) {
            var dest_file = dw.doURLEncoding(ABS_IMAGES_PATH + DELIMITER_PATH + list_files[j]);
            var src_file = dw.doURLEncoding(src_folder + DELIMITER_PATH + list_files[j]);
            
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