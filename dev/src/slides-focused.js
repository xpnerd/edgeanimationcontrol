/*
 * SLIDES
 * 
 * functions with focus on (nemo)slides.
 */

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

/**
 * Not documented yet.
 * @deprecated since version 2.2.0
 * @param {*} toIndex 
 * @param {*} fromIndex 
 * @param {*} datastayString 
 */
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

/**
 * Not documented yet.
 * @deprecated since version 2.2.0
 * @param {*} startlist 
 * @param {*} endlist 
 */
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

/**
 * Not documented yet.
 * @deprecated since version 2.2.0
 * @param {*} index 
 * @param {*} startlist 
 * @param {*} endlist 
 */
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

/**
 * Not documented yet.
 * @deprecated since version 2.2.0
 * @param {*} data 
 */
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

/**
 * Not documented yet.
 * @deprecated since version 2.2.0
 * @param {*} node 
 */
function nemo_getNodeDataStay(node) {
    var stayAttr = 'data-stay';
    if(!node || (node && node.getAttribute(stayAttr))) return;

    return nemo_getDataStay(node.getAttribute(stayAttr));
}

/**
 * Returns the nemo type of the selection
 * @deprecated since version 2.2.0
 * @example
 * // return 0; component can not be imported here
 * @example
 * // return 1; selection is inside a slide
 * @example
 * // return 2; selection is inside a experimentpanel
 */
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

/**
 * Not documented yet.
 * @deprecated since version 2.2.0
 */
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

/**
 * Not documented yet.
 * @deprecated since version 2.2.0
 */
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

/**
 * Not documented yet.
 * @deprecated since version 2.2.0
 */
function nemo_getPanelOffset() {

    var REGEX_HEIGHT = /height:[\s]*(\d+)(?=px)/;
    var REGEX_TOP = /top:[\s]*(\d+)(?=px)/;
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

/**
 * Not documented yet.
 * @deprecated since version 2.2.0
 * @param {*} node 
 */
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

/**
 * Not documented yet.
 * @deprecated since version 2.2.0
 */
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

/**
 * Not documented yet.
 * @deprecated since version 2.2.0
 */
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

/**
 * Not documented yet.
 * @deprecated since version 2.2.0
 * @param {*} includePreservedFunctions 
 */
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

/**
 * Not documented yet.
 * @deprecated since version 2.2.0
 * @param {*} configjson 
 */
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

/**
 * Not documented yet.
 * @deprecated since version 2.2.0
 * @param {*} filename 
 */
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

/**
 * Not documented yet.
 * @deprecated since version 2.2.0
 * @param {*} folderpath 
 */
function nemo_getFileNamesOfAnimatedContent(folderpath) {
    var files = DWfile.listFolder(folderpath);
    var htmlFiles = [];
    for (var i = 0; i < files.length; i++) {
        if (REGEX_ISHTML.test(files[i])) htmlFiles.push(files[i]);
    }

    return htmlFiles;
}