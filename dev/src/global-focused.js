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
// GENERAL
nm.initPaths = nemo_initPaths;
nm.getStringTrailing = nemo_getStringTrailing;
nm.getStringSliceUpTo = nemo_getStringSliceUpTo;
nm.contains = nemo_contains;
nm.isValidDocument = nemo_isValidDocument;
nm.recurseTask = nemo_recurseTask;
// FILE
nm.getDocumentFileName = nemo_getDocumentFileName;                      // DEPRECATED
nm.copyFiles = nemo_copyFiles;
// FOLDER
nm.getFolderPath = nemo_getFolderPath;                                  // DEPRECATED
nm.getParentFolderPath = nemo_getParentFolderPath;
nm.getFolderPathBrowse = nemo_getFolderPathBrowse;
// SLIDE
nm.getSlideNodes = nemo_getSlideNodes;
nm.getCurrentSlide = nemo_getCurrentSlide;
nm.getStageWidth = nemo_getStageWidth;
nm.getStageHeight = nemo_getStageHeight;
nm.addSlideToStay = nemo_addSlideToStay;                                // DEPRECATED
nm.createDataStayString = nemo_createDataStayString;                    // DEPRECATED
nm.isElementOnSlide = nemo_isElementOnSlide;                            // DEPRECATED
nm.getDataStay = nemo_getDataStay;                                      // DEPRECATED
nm.getNodeDataStay = nemo_getNodeDataStay;                              // DEPRECATED
nm.getSelectionType = nemo_getSelectionType;                            // DEPRECATED
nm.getActiveSlideNode = nemo_getActiveSlideNode;                        // DEPRECATED
nm.getOutsideBoxNode = nemo_getOutsideBoxNode;                          // DEPRECATED
nm.getPanelOffset = nemo_getPanelOffset;                                // DEPRECATED
nm.isInsidePanel = nemo_isInsidePanel;                                  // DEPRECATED
nm.getRandomPosition = nemo_getRandomPosition;                          // DEPRECATED
nm.getExperimentWell = nemo_getExperimentWell;                          // DEPRECATED
nm.getUserFunctionsFromDocument = nemo_getUserFunctionsFromDocument;    // DEPRECATED
nm.getContentFilesIdentifiers = nemo_getContentFilesIdentifiers;        // DEPRECATED
nm.filenameIdentifier = nemo_filenameIdentifier;                        // DEPRECATED
nm.getFileNamesOfAnimatedContent = nemo_getFileNamesOfAnimatedContent;  // DEPRECATED
// JSON
nm.getConfigJSONFilePath = nemo_getConfigJSONFilePath;                  // DEPRECATED
nm.getConfigJSON = nemo_getConfigJSON;                                  // DEPRECATED
nm.writeConfigJSON = nemo_writeConfigJSON;                              // DEPRECATED
nm.findItemInJSON = nemo_findItemInJSON;                                // DEPRECATED
nm.checkConfigJSON = nemo_checkConfigJSON;                              // DEPRECATED
// ANIMATION
nm.isValidAnimeFolder = nemo_isValidAnimeFolder;
nm.isValidAnimeDiv = nemo_isValidAnimeDiv;
nm.getAnimeName = nemo_getAnimeName;
nm.isModified = nemo_isModified;
nm.importEdgeFiles = nemo_importEdgeFiles;
nm.insertTag = nemo_insertTag;
nm.delEdgeActions = nemo_delEdgeActions;
nm.getEdgeAnimations = nemo_getEdgeAnimations;
nm.addEdgeAnimation = nemo_addEdgeAnimation;
nm.updateEdgeAnimation = nemo_updateEdgeAnimation;
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
var REGEX_CHANGE_SPECIAL = / /g; // Remove any spaces.
/// /^[_\d]*| /g; //remove any digits and underscores in front of the first proper character and any spaces.

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