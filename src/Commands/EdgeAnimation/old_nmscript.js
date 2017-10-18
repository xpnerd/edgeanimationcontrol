//DEPRECATED!
/*

    Nemo class

*/
// var REGEX_START = /\d+(?=-\d+([\s|,]|$))/g;
// var REGEX_END = /(?!\-)\d+(?=([\s|,]|$))/g;
// var REGEX_ALL = /(?:\d*\.)?\d+/g; 
// var REGEX_GROUPS = /\d+[-]\d+/g;
// var REGEX_ST = /\d+(?=-)/;
// var REGEX_EN = /(?!\-)\d+(?=([\s|,]|$))/g;
// var pathpatt = /^(.*[\\\/])/;
// var REGEX_PATH = /^(.*[\\\/])/;
// var REGEX_ANIMATIONNAME = /[^\/]+(?=_edge)/; /// animation name from file
// var REGEX_SOURCEFOLDER = /.*(?=\/)/;
// var REGEX_COMPOSITIONCLASS = /AdobeEdge,('|")([^'"]+)('|")/;
// var REGEX_LABELGROUP = /(,[\s]*l[\s]*:[\s]*{[^}]*\})/;
// var REGEX_LABEL = /\"[^"]*\"(?=:)/g;
// 
var SLIDES = "slides";
var SLIDESWRAPPER = "slideswrapper";
var SLIDE = "slide";
var ACTIVESLIDE = "active";
var GHOSTCONTAINER = "ghost_container";
var GHOSTCOVER = "ghost_cover";
var DATASTAY = "data-stay";


var ANIMATIONSFOLDER = "animations";
var EDGEFILE = "_edge.js";

var REGEX_HEIGHT = /height:[\s]*(\d+)(?=px)/;
var REGEX_WIDTH = /width:[\s]*(\d+)(?=px)/;
var REGEX_LEFT = /left:[\s]*(\d+)(?=px)/;
var REGEX_TOP = /top:[\s]*(\d+)(?=px)/;

var REGEX_PATH = /^(.*[\\\/])/;
var REGEX_FILENAME = /[^\\\/:*?"<>|\r\n]+$/;
var REGEX_ISHTML = /(\.|\/)(html?)$/i;

var ANIMATIONCLASS = "EdgeAnimation";


function nm() {}

nm.getSelectionType = nemo_getSelectionType;
nm.getActiveSlideNode = nemo_getActiveSlideNode;
nm.getOutsideBoxNode = nemo_getOutsideBoxNode;
nm.contains = nemo_contains;
nm.getSlideNodes = nemo_getSlideNodes;
nm.getCurrentSlide = nemo_getCurrentSlide;
nm.getPanelOffset = nemo_getPanelOffset;
nm.isInsidePanel = nemo_isInsidePanel;
nm.getStageWidth = nemo_getStageWidth;
nm.getStageHeight = nemo_getStageHeight;
nm.getRandomPosition = nemo_getRandomPosition;
nm.getExperimentWell = nemo_getExperimentWell;
nm.getUserFunctionsFromDocument = nemo_getUserFunctionsFromDocument;
nm.getDocumentFileName = nemo_getDocumentFileName;

nm.addSlideToStay = nemo_addSlideToStay;
nm.createDataStayString = nemo_createDataStayString;

nm.getDataStay = nemo_getDataStay;
nm.getNodeDataStay = nemo_getNodeDataStay;
nm.isElementOnSlide = nemo_isElementOnSlide;
nm.getFolderPath = nemo_getFolderPath;
nm.getConfigJSONFilePath = nemo_getConfigJSONFilePath;
nm.getConfigJSON = nemo_getConfigJSON;
nm.writeConfigJSON = nemo_writeConfigJSON;
nm.findItemInJSON = nemo_findItemInJSON;
nm.checkConfigJSON = nemo_checkConfigJSON;
nm.filenameIdentifier = nemo_filenameIdentifier;
nm.getContentFilesIdentifiers = nemo_getContentFilesIdentifiers;
nm.getFileNamesOfAnimatedContent = nemo_getFileNamesOfAnimatedContent;

nm.isValidDocument = nemo_isValidDocument;


function nemo_addSlideToStay(toIndex, fromIndex, datastayString) {
    if(datastayString === undefined) {
        if(fromIndex < toIndex) {
            return fromIndex + '-' + toIndex;
        } 
        return toIndex + '-' + fromIndex;
    } 
    var datastay = nemo_getDataStay(datastayString);
    if(datastay && datastay.start && datastay.end) {
        var start = datastay.start; var end = datastay.end;
        // The element is already stayed to the desired position. Just return the original string
        if(start.indexOf(toIndex) != -1 || end.indexOf(toIndex) != -1) return datastayString;

        var newStart = start, newEnd = end; 
        var extendStart = [], extendEnd = [];
        for(var j = 0; j < start.length; j++) {
            extendStart.push(start[j]-1);
            extendEnd.push(end[j]+1);
        }
        if((locus = extendStart.indexOf(toIndex)) != -1) {
            newStart[locus] = toIndex;
        } else if((locus = extendEnd.indexOf(toIndex)) != -1) {
            newEnd[locus] = toIndex;
        } else {
            // nothing has changed, but that is opvallend
            return datastayString;
        }

        return nemo_createDataStayString(newStart, newEnd);
    }

    return;
}

function nemo_createDataStayString(startlist, endlist) {
    if(startlist.length !== endlist.length) return;

    var str = '';
    var length = startlist.length;

    for(var i = 0; i < length; i++) {
        str += startlist[i];
        str += '-';
        str += endlist[i];
        if(i !== length-1) str += ' ';
    }

    if(str === '') return;
    else return str;
}

function nemo_isElementOnSlide(index, startlist, endlist) {
    if(startlist.length !== endlist.length) return;

    for(var i = 0; i < startlist.length; i++) {
        var start = startlist[i];
        var end = endlist[i];

        if(index >= start && index <= end) {
            return true;
        }
    }
    return false;
}

function nemo_getDataStay(data) {
    if(!data) return false;
    var returnObject = {};
    var REGEX_START = /\d+(?=-\d+([\s|,]|$))/g;
    var REGEX_END = /(?!\-)\d+(?=([\s|,]|$))/g;

    //var start = data.match(REGEX_START);
    //var end = data.match(REGEX_END);
    var startlist = [], endlist = [];
    var output;
    while((result = REGEX_START.exec(data)) !== null) {
        output = parseInt(result);
        if(!isNaN(output)) startlist.push(output);
    }

    while((result = REGEX_END.exec(data)) !== null) {
        output = parseInt(result);
        if(!isNaN(output)) endlist.push(output);
    }

    if(startlist.length > 0 && startlist.length === endlist.length) {
        returnObject.start = startlist;
        returnObject.end = endlist;
        return returnObject;
    }

    return false;
}

function nemo_getNodeDataStay(node) {
    var stayAttr = 'data-stay';
    if(!node || (node && node.getAttribute(stayAttr))) return;

    return nemo_getDataStay(node.getAttribute(stayAttr));
}

// Returns the nemo type of the selection
// return 0; component can not be imported here
// return 1; selection is inside a slide
// return 2; selection is inside a experimentpane
function nemo_getSelectionType() {
    // Set default type to zero
    var type = 0;
    var dom = dw.getDocumentDOM();
    var curSel = dom.getSelection();
    var curSelNode = dom.getSelectedNode();
    var isCursor = (curSel[0] == curSel[1]) ? true : false;

    var pattSlide = new RegExp("slide");
    var pattExperiment = new RegExp("nm_Experiment");


    while (curSelNode) {
        if (curSelNode.class) {
            if (pattSlide.test(curSelNode.class)) {
                type = 1;
                break;
            } else if (pattExperiment.test(curSelNode.class)) {
                type = 2;
                break;
            }
        }

        if (curSelNode.id) {
            if (curSelNode.id === SLIDES) break;
        }

        curSelNode = curSelNode.parentNode;
    }

    return type;

}

function nemo_getActiveSlideNode() {
    var dom = dw.getDocumentDOM();
    var i = 0; // Counter to loop thtrouhg slides
    var slide = dom.getElementById("slide" + i); // Get first slide
    var patt = new RegExp("activeSlide"); // Regex to find the active slide

    // Continue until we could find a new slide
    while (slide) {
        if (slide.class) {
            // Has class? This element is nemo proof
            if (patt.test(slide.class)) {
                // Does it contain the text activeSlide? 
                // This is the slide where we looking for!
                return slide;
            }

        } else {
            break;
        }

        // Nothing found, so increase i with one. Check if we could find this slide. 
        i++;
        slide = dom.getElementById("slide" + i);
    }

    return false;
}

function nemo_getExperimentWell() {
    var slide = nemo_getCurrentSlide();
    var elements = slide && slide.childNodes;
    var isexperimentpanel = false;
    var experimentpanel;
    var wellnode;
    var iswell = false;

    if (elements !== undefined && elements.length > 0) {
        for (var i = 0; i < elements.length; i++) {
            var e = elements[i];
            var classlist = e.class && e.class.split(" ");
            isexperimentpanel = classlist && nemo_contains(classlist, "panel-experiment");
            if (isexperimentpanel) {
                experimentpanel = e;
                break;
            }
        }

        if (isexperimentpanel && experimentpanel.childNodes.length > 0) {
            var panelbody = experimentpanel.childNodes[1];
            var pbclasslist = panelbody && panelbody.class && panelbody.class.split(" ");
            var haspanelbody = pbclasslist && nemo_contains(pbclasslist, "panel-body");

            if (haspanelbody) {
                elements = panelbody.childNodes;
                for (var j = 0; j < elements.length; j++) {
                    var se = elements[j];
                    var subclasslist = se.class && se.class.split(" ");
                    iswell = subclasslist && nemo_contains(subclasslist, "well");

                    if (iswell) {
                        wellnode = se;
                        return wellnode;
                    }
                }

                if (!iswell) {
                    experimentpanel.innerHTML += '<div class="well"></div>';
                    var end = experimentpanel.childNodes.length - 1;
                    wellnode = experimentpanel.childNodes[end];
                    return wellnode;
                }
            }

        }
    }

    return -1;
}


function nemo_getPanelOffset() {
    var slide = nemo_getCurrentSlide();
    var elements = slide && slide.childNodes;
    var top = 0;
    var height = 0;

    if (elements !== undefined && elements.length > 0) {
        for (var i = 0; i < elements.length; i++) {
            var e = elements[i];
            var classlist = e.class && e.class.split(" ");
            var ispanel = classlist && nemo_contains(classlist, "panel");
            var isdefault = classlist && nemo_contains(classlist, "panel-default");

            if (ispanel && e.getAttribute('style') !== undefined) {
                var style = e.getAttribute("style");
                var h = style.match(REGEX_HEIGHT);
                var t = style.match(REGEX_TOP);

                if (isdefault && h !== null && h.length >= 1 && t !== null && t.length >= 1) {
                    h = parseInt(h[1]);
                    t = parseInt(t[1]);

                    if (!isNaN(h) && !isNaN(t) && t >= top && h >= height) {
                        top = t;
                        height = h;
                    }
                } else if (!isdefault && t !== null && t.length >= 1) {
                    t = parseInt(t[1]);

                    if (!isNaN(t) && t >= top) {
                        top = t;
                        height = 120;
                    }
                }
            }
        }
    }


    return (top + height) + 20;
}

function nemo_getOutsideBoxNode() {
    var dom = dw.getDocumentDOM();
    var curSelNode = dom.getSelectedNode();
    var patt = new RegExp("panel-body");
    var rtn = false;

    while (curSelNode) {
        if (curSelNode.class) {
            if (patt.test(curSelNode.class)) {
                rtn = curSelNode;
                break;
            }
        }

        if (curSelNode.id) {
            if (curSelNode.id == "contentDiv") break;
        }

        curSelNode = curSelNode.parentNode;
    }

    return rtn;
}

function nemo_getStageWidth() {
    var dom = dw.getDocumentDOM();
    var width = -1;
    var slideNode = nemo_getCurrentSlide();
    width = slideNode && slideNode.getComputedStyleProp("width");
    return width;


}

function nemo_getStageHeight() {
    var dom = dw.getDocumentDOM();
    var height = -1;
    var slideNode = nemo_getCurrentSlide();
    height = slideNode && slideNode.getComputedStyleProp("height");
    return height;
}

function nemo_getRandomPosition() {
    var margin = 100;
    var pos = {};
    pos.left = 0;
    pos.top = 0;
    var maxwidth = nemo_getStageWidth();
    var maxheight = nemo_getStageHeight();

    if (maxwidth != -1 && maxheight != -1) {
        pos.left = margin + Math.floor(Math.random() * (maxwidth - 2 * margin));
        pos.top = margin + Math.floor(Math.random() * (maxheight - 2 * margin));
    }

    return pos;
}


function nemo_getCurrentSlide() {
    var i = -1;
    var slides = nemo_getSlideNodes();

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

function nemo_getSlideNodes() {
    var dom = dw.getDocumentDOM();
    var slides = [];
    if (dom !== null) {
        var sw = dom.getElementById(SLIDESWRAPPER);
        if (sw !== undefined) {
            slides = sw.childNodes;
            slides.shift(); // remove slide stay wrapperc
        }
    }
    return slides;
}

function nemo_isInsidePanel(node) {
    var retVal = false;
    var currNode = node;
    var panellookup = "panel-body";
    var nodeclass;

    if (currNode.nodeType == Node.TEXT_NODE) {
        currNode = node.parentNode;
    }

    while (currNode !== null && currNode.nodeType == Node.ELEMENT_NODE) {
        if (currNode.class) {
            nodeclass = currNode.class;
            var classlist = nodeclass && nodeclass.split(" ");

            if (nemo_contains(classlist, panellookup)) {
                retVal = true;
                break;
            } else if (nemo_contains(classlist, 'slide')) {
                break;
            }
        }


        currNode = currNode.parentNode;
    }

    return retVal;
}


function nemo_contains(a, obj) {
    var i = a.length;
    while (i--) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

function nemo_getUserFunctionsFromDocument(includePreservedFunctions) {
    if (!includePreservedFunctions) includePreservedFunctions = false;
    var dom = dw.getDocumentDOM();
    var documentScripts = dom.getElementsByTagName("SCRIPT");

    var preservedScriptId = ['EdgeAnimationActions', 'NemoInit'];
    var preservedFunctions = ['nemo_slide', 'nemo_onload'];

    var regex_getFunctionsNames = /function[\s]+([^\(]+)\(/g;
    var userScriptsString = '';
    var documentFunctions = [];

    if (documentScripts) {
        for (var i = 0; i < documentScripts.length; i++) {
            var node = documentScripts[i];

            // stop the iteration, if one of these cases happen
            if (node.src || (node.id && isPreservedScriptId(node.id)) || /^\s*$/.test(node.innerHTML)) continue;

            userScriptsString += node.innerHTML + ' ';
        }

        if (userScriptsString !== '') {
            //.. retrieve functions;
            var result;
            while ((result = regex_getFunctionsNames.exec(userScriptsString)) !== null) {
                var name = result[1]; // based on regex construction
                var isUserFunction = true;

                for (var p = 0; p < preservedFunctions.length; p++) {
                    if (name === preservedFunctions[p]) isUserFunction = false;
                }

                if (isUserFunction || includePreservedFunctions) documentFunctions.push(name);
            }

            if (documentFunctions.length > 0) return documentFunctions;
        }
    }

    return false;

    function isPreservedScriptId(id) {
        for(var i = 0; i < preservedScriptId.length; i++) 
            if(id === preservedScriptId[i]) return true;
        return false;
    }
}


function nemo_getDocumentFileName() {
    var documentpath = dw.getDocumentPath("document");
    if (!documentpath) return;
    return REGEX_FILENAME.exec(documentpath)[0];
}


function nemo_getFolderPath() {
    var folderPath;
    folderPath = dw.getDocumentPath("document");
    folderPath = folderPath && REGEX_PATH.exec(folderPath);
    folderPath = folderPath.length > 0 && folderPath[0];
    return folderPath;
}

function nemo_getConfigJSONFilePath(folderPath) {
    filepath = folderPath && (folderPath + 'properties.json');
    return filepath;
}

function nemo_getConfigJSON() {
    var folderpath = nemo_getFolderPath();
    var filepath = nemo_getConfigJSONFilePath(folderpath);
    var doesFileExists = filepath && DWfile.exists(filepath);
    var configJSON;

    if (doesFileExists) {
        var configdata = filepath && DWfile.exists(filepath) && DWfile.read(filepath);
        configJSON = configdata && JSON.parse(configdata);
    } else {
        var exampleJSON = {
            "title": "",
            "content": []
        };
        var exampleStr = JSON.stringify(exampleJSON, null, 2);
        if (exampleStr && DWfile.write(filepath, exampleStr)) configJSON = exampleJSON;
    }

    if (configJSON && configJSON.content) return configJSON;
    else return;
}

function nemo_writeConfigJSON(configJSON) {
    if (!configJSON) return false;
    var folderpath = nemo_getFolderPath();
    var filepath = nemo_getConfigJSONFilePath(folderpath);
    var configdata = JSON.stringify(configJSON, null, 2);

    if (configdata && filepath && DWfile.exists(filepath)) {
        return DWfile.write(filepath, configdata);
    }
    return false;
}

function nemo_findItemInJSON(obj, item, group) {
    for (var j in obj) {
        var result = obj[j][group];
        if (result && result == item) {
            return j;
        }
    }
    return -1;
}

function nemo_checkConfigJSON(configjson) {
    if (configjson && !configjson.content) return;
    var folderpath = nm.getFolderPath();

    var htmlFiles = nm.getFileNamesOfAnimatedContent(folderpath);
    var missingFileIndices = [];
    var notListedHTMLFiles = htmlFiles;
    var removeFiles = [];

    if (!htmlFiles) return;

    for (var i = 0; i < configjson.content.length; i++) {
        var filename = configjson.content[i].file;
        if (!filename) return;

        // Get all html files in folder, which are not listed in config.json
        for (var p = 0; p < notListedHTMLFiles.length; p++) {
            if (filename === notListedHTMLFiles[p]) {
                notListedHTMLFiles.splice(p, 1);
                break;
            }
        }

        // Get all the files from the config.json that are missing
        if (!DWfile.exists(folderpath + filename)) {
            missingFileIndices.push(i);
        }
    }

    var changedJSON = false;
    if (notListedHTMLFiles.length > 20) return; // Dit is echt teveel moeite en onrealistisch. Stop ermee
    for (var j = 0; j < missingFileIndices.length; j++) {
        var contentTitle = configjson.content[missingFileIndices[j]].name;
        var foundTheFile = false;
        for (var k = 0; k < notListedHTMLFiles.length; k++) {
            var fileStr = DWfile.read(folderpath + notListedHTMLFiles[k]);
            var lookUp = new RegExp('<title>' + contentTitle + '<\/title>');
            var isFile = fileStr && lookUp.test(fileStr);
            if (isFile && !foundTheFile) {
                foundTheFile = true;
                configjson.content[missingFileIndices[j]].file = notListedHTMLFiles[k];

                notListedHTMLFiles.splice(k, 1);
                changedJSON = true;
            } else if (isFile && foundTheFile) {
                // Whoops! We found multiple hits; too difficult to solve this issue. Just leave it as it is
                break;
            }
        }

        // None of the files do match the criteria; probably, the file is deleted from JSON
        if (!foundTheFile) {
            removeFiles.push(missingFileIndices[j]);
            //configjson.content.splice(missingFileIndices[j],1);
            changedJSON = true;
        }
    }

    if (removeFiles.length) {
        // Sort from high to low, which makes removing easier
        missingFileIndices.sort(function(a, b) { return b - a;});
        for (i = 0; i < missingFileIndices.length; i++) {
            var index = missingFileIndices[i];
            configjson.content.splice(index, 1); // remove instance
        }
    }

    var identifiers = nemo_getContentFilesIdentifiers(configjson);
    if (identifiers) {
        identifiers.sort(sortNumber);
        var temp_content = [];
        var orderHasChanged = false;
        for (var z = 0; z < identifiers.length; z++) {
            temp_content[z] = configjson.content[identifiers[z][0]];
            if (z !== identifiers[z][0]) orderHasChanged = true;
        }

        if (orderHasChanged) {
            configjson.content = temp_content;
            changedJSON = true;
        }
    }

    if (changedJSON) return configjson;
    else return;

    function sortNumber(a, b) {
        if (a[1] === b[1]) {
            return 0;
        } else {
            return (a[1] < b[1]) ? -1 : 1;
        }
    }
}

function nemo_getContentFilesIdentifiers(configjson) {
    if (configjson && !configjson.content) return;
    var identifierList = [];
    var notFound = false;

    for (var i = 0; i < configjson.content.length; i++) {
        var filename = configjson.content[i].file;
        var result;
        if (filename && (result = nemo_filenameIdentifier(filename))) {
            identifierList.push([i, result]);
        } else {
            notFound = true;
            // quit immediately; list is not consistent
            break;
        }
    }

    if (!notFound) return identifierList;
    return;
}

function nemo_filenameIdentifier(filename) {
    var patt = /\d{2,3}[\-\s\_\.]/g;
    var results = filename.match(patt);
    if (results !== null) {
        var str = results[results.length - 1];
        var result = parseInt(str.slice(0, -1));
        if (!isNaN(result)) return result;
    }
    return false;
}

function nemo_getFileNamesOfAnimatedContent(folderpath) {
    var files = DWfile.listFolder(folderpath);
    var htmlFiles = [];
    for (var i = 0; i < files.length; i++) {
        if (REGEX_ISHTML.test(files[i])) htmlFiles.push(files[i]);
    }

    return htmlFiles;
}

function nemo_isValidDocument() {
    return (dw.getDocumentDOM() != null && dw.getDocumentDOM().getElementById('slides') != null && dw.getDocumentDOM().documentType != 'XSLT-fragment' && dw.getDocumentDOM().getParseMode() == 'html' && (dw.getActiveWindow(true) != null && dw.getActiveWindow(true).allowsEdits()));
}