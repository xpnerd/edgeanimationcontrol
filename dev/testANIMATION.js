/*
* Case 1: add edgeAnimation and choose one from a file
*
* Case 2: added the div, but did not assign an edgeAnimation (problem?)
*       Assign with different button... which has a window/interface.
*       With the right buttons ofcourse.
*/

// Create an XML object from a series of inputs
//
//   _a - an array of values to be parsed into XML
//
// Returns an string formatted as xml
function toXML(_a){
    var xml = '<object>';
    for(var i=0;i<_a.length;i++){
      xml    += convertToXML(_a[i].val.toString(), _a[i].name.toString());
    }
    xml    += '</object>';
    return xml;
  } // end toXML()

/**
 * [checkForAnimations description]
 * @return {[type]} [description]
 */
function checkForAnimations(){
    var localPathPatt = /\/\/updatePath:[^*]*/;
    var folderpath = nm.getFolderPath();
    var fileURL;

    if(DWfile.exists(folderpath + ANIMATIONSFOLDER)){

        var list = DWfile.listFolder(folderpath + ANIMATIONSFOLDER, "directories");
        var pathList = [];
        //fill animations from named of the folders
        if (list){
            for(var i=0; i<list.length; i++){
                fileURL    = folderpath + ANIMATIONSFOLDER + "/" + list[i] + "/" + list[i] + EDGEFILE;
                var str    = DWfile.read(fileURL);
                var result = localPathPatt.exec(str);
                if(result !== null){
                    pathList.push(result[0].substring(13));
                }else {
                    pathList.push(""); //add an empty, to keep the order aligned.
                }
            }
            if(list.length <= 0) {
                return toXML([ {'name':'animations', 'val':"none"}, {'name':'paths', 'val':"none"} ]);
            } else {
                return toXML([ {'name':'animations', 'val':list.join(",")}, {'name':'paths', 'val':pathList.join(",")} ]);
            }
        } else {
            return toXML([ {'name':'animations', 'val':"none"}, {'name':'paths', 'val':"none"} ]);
        }
    }else{
        return toXML([ {'name':'animations', 'val':"none"}, {'name':'paths', 'val':"none"} ]);
    }
     return toXML([ {'name':'animations', 'val':"none"}, {'name':'paths', 'val':"none"} ]);
}

/*
user selects the path to the web export
floater copies the image folder content to the image folder in the site root
floater copies the js files to the aniamtionJS folder in the site root
floater copies content of the edgePreload.js file to memory
floater edits the urls to the js files.
floater writes the edited content back to the edgeProload.js file.

display a list of animations and their name.
Ability to add and remove aniamtiosn
abiliy to update them
ability to fill the current selected animation-object with the selected animation
  -loads the container div with the prober id and class
  -adds the right call to the OLO loader
  */

function getAnimationNode() {
    var dom = dw.getDocumentDOM();
    var isanimation = false;

    if (dom !== null && (typeof dom.getSelectedNode === 'function')) {

        var e = dom.getSelectedNode();
        if(e !== undefined && (typeof e.getAttribute === 'function') && e.getAttribute('class') !== undefined) {
            var classlist = e.class.split(" ");
            isanimation = classlist && contains(classlist, ANIMATIONCLASS);
        }

        if(isanimation && e.getAttribute('data-name') !== undefined) {
            var animationName = e.getAttribute('data-name');
            return toXML([{'name': 'name', 'val': animationName}]);
        } else if(isanimation) {
            return toXML([{'name': 'name', 'val': 'emptyanicontainer'}]);
        }
    }

    return toXML([{'name': 'name', 'val': '-1'}]);
}

function addEdgeAnimation(givenname, givenpath) {
    FOLDERPATH = nm.getFolderPath();
    var dom = dw.getDocumentDOM();
    var animationFileURL;
    var destFolderURL;
    var sourcePreloadURL, sourcePreloadFile;
    var animationsSourceURL = FOLDERPATH.replace(/(_web)[\s\S]*/, '') + 'animations_src/';
    var absoluteSourceURL, absoluteRootURL;
    var isNewAnimation = givenpath === "" || givenpath === undefined || givenpath === null;
    //
    // Get the animation file
    //
    if(!isNewAnimation) { // in case of an already defined animation
        var absoluteGivenPath = dreamweaver.relativeToAbsoluteURL(dreamweaver.getDocumentPath("document"), FOLDERPATH, givenpath);
        if(DWfile.exists(absoluteGivenPath)) {
            animationFileURL = givenpath; // the given animation still exists
        } else { // animation not found, request new url
            animationFileURL = dreamweaver.browseForFileURL("select", "Select an Adobe Edge javascript file.", false, true, new Array("Edge JavaScript files (*.js)|*.js||"), animationsSourceURL, false, "" );
            givenpath = "none";
        }
    } else {
        // In case of a new animation
        animationFileURL = dreamweaver.browseForFileURL("select", "Select an Adobe Edge javascript file.", false, true, new Array("Edge JavaScript files (*.js)|*.js||"), animationsSourceURL, false, "" );
    }

    //
    // If animation file is present, do something with it
    //
    if(animationFileURL !== undefined && animationFileURL !== false && animationFileURL !== '') {
        //
        // We DO have an animation file!
        //
        var error = false; var animationName, sourceFolderURL, edgeFile, edgeURL; // init variables

        //
        // Retrieve animation name and location from URL
        //
        if(isNewAnimation) {
            animationName = REGEX_ANIMATIONNAME.exec(animationFileURL);
            sourceFolderURL = REGEX_SOURCEFOLDER.exec(animationFileURL);
        } else {
            animationName = givenname; //else, get name from givenName
            sourceFolderURL = givenpath; //else, get path from givenPath
        }
        if((animationName === "") || (sourceFolderURL === "")) error = "Failed to import animation. This is not a correct file."; // Check name and folder

        if(!error) {
            //
            //  Check if sourceFolderURL is published folder
            //
            var isPublishedSourceFolderURL = /publish\/web/.test(sourceFolderURL);
            if(!isPublishedSourceFolderURL) {
                sourceFolderURL = sourceFolderURL + "/publish/web";
            }

            //
            //  Check if the published edge files exists (from directory)
            //
            //
            absoluteRootURL = dreamweaver.relativeToAbsoluteURL(dreamweaver.getDocumentPath("document"), FOLDERPATH, sourceFolderURL);
            absoluteSourceURL = absoluteRootURL + '/' + animationName + EDGEFILE;
            if(!DWfile.exists(absoluteSourceURL)) {
                error = "Please publish (Ctrl+Alt+S) your animation first. Could not find published files.";
            }
        }

        if(!error) {
            var sourcefile = DWfile.read(absoluteSourceURL);
            if(!/vid=/.test(sourcefile)) {
                error = "Animation not supported. Please update your animation to the 5.x version (Adobe Edge Animate CC 2014).";
            }
        }



        if(!error) {
            //
            //  Create animations and images folder inside _web directory (if not exists)
            //
            if (!DWfile.exists(FOLDERPATH + ANIMATIONSFOLDER)) DWfile.createFolder(FOLDERPATH + ANIMATIONSFOLDER);
            if (!DWfile.exists(FOLDERPATH + "images")) DWfile.createFolder(FOLDERPATH + "images");

            //
            //  Generate target folder
            //
            destFolderURL = FOLDERPATH + ANIMATIONSFOLDER + "/" + animationName;

            //
            //  Check if the to directory already exists. That means that we're updating an older animation
            //
            if(DWfile.exists(destFolderURL + "/" + animationName + EDGEFILE)){
                        // Check if the file includes the text NEMO. Yes? User should first Publish his file
                //sourcePreloadURL = sourcedestFolderURL + "/" + animationName + EDGEFILE;
                //open a file
                //
                // get file modification data and compare with
                destEdgeFile = DWfile.read(destFolderURL + "/" + animationName + EDGEFILE);
                var mPatt = /\/\/modificationDate:[^*]*/;

                var result = mPatt.exec(destEdgeFile);
                var destModificationDate = result && result[0].substring(19);

                var sourceModificationDate = DWfile.getModificationDate(absoluteSourceURL);

                if(destModificationDate === sourceModificationDate) {
                    error = "Update failed. Please re-publish your animation first.";
                } else {
                    alert("Updating an older version of " + animationName + "!");
                    DWfile.remove(destFolderURL + "/" + animationName + EDGEFILE);
                }

            } else { //not updating, create the folder
                DWfile.createFolder(destFolderURL);
            }

        }


        if(error) {
            alert(error);
            return toXML([{'name':'animation', 'val':"none"},{'name':'path', 'val':"none"}]);
        } else {
            //
            //  It's time to copy the files!
            //
            DWfile.copy(absoluteSourceURL, destFolderURL + "/" + animationName + EDGEFILE); //copy all the Js files to that place
            var mDate = DWfile.getModificationDate(absoluteSourceURL);


            // Copy all the images to root/images
            var list = DWfile.listFolder(absoluteRootURL + "/images/");
            if (list){
                var doTheSame = undefined;
                var didAnOverride = undefined;
                for(var j=0; j<list.length; j++) {
                    var absoluteDestinationImageURL = dreamweaver.relativeToAbsoluteURL(dreamweaver.getDocumentPath("document"), FOLDERPATH, "/images/" + list[j]);
                    if( isNewAnimation && DWfile.exists(absoluteDestinationImageURL) ) {
                        if(doTheSame === undefined && didAnOverride !== undefined) {
                            doTheSame = confirm("Do you want to " + ( didAnOverride ? "override" : "ignore" ) + " all upcoming files?");
                        }

                        if(doTheSame && (didAnOverride !== undefined)) {
                            var overrideTheFile = didAnOverride;
                            if(!overrideTheFile) break;
                        } else {
                            var overrideTheFile = confirm("The image " + list[j] + " already exists in your images directory. Would you like to override the file?");
                            didAnOverride = overrideTheFile;
                            if(!overrideTheFile) continue;
                        }
                    }
                    //alert(absoluteRootURL + "/images/" + list[j]);
                    DWfile.copy(absoluteRootURL + "/images/" + list[j], absoluteDestinationImageURL);
                }
            }


            //
            // Edit the preload file! Get the _edge.js file
            //
            edgeURL = destFolderURL + "/" + animationName + EDGEFILE; // translate fileurl to edgeurl
            edgeFile = DWfile.read(edgeURL);  // Read the edge file

            //
            //  Flag the animation source file that we've imported it. T
            //
            //sourcePreloadURL = sourceFolderURL + "/" + animationName + EDGEFILE;
            // sourcePreloadFile = DWfile.read(absoluteSourceURL);
            // if(!/Imported by Nemo/.test(sourcePreloadFile)) {
            //     DWfile.write(absoluteSourceURL, (" \/* Imported by Nemo *\/ " + sourcePreloadFile));
            // }


            if(!edgeFile) {
                alert("Could not read the animation file.");
                return toXML([{'name':'animation', 'val':"none"},{'name':'path', 'val':"none"}]);
            } else {
                //
                //  Replace variables location
                //
                temp_edgeFile = edgeFile;
                temp_edgeFile = temp_edgeFile.replace(/(var im=')[\S\s]*?'/g, "var im='images/'"); // original string = var im='animations/afbuigen_50/assets/images/'
                temp_edgeFile = temp_edgeFile.replace(/scripts=\[[^\]]*\]/, "scripts=\[\]"); // remove external scripts

                //
                //  Add some usefull info
                //
                //edgePreloadFile = edgePreloadFile.replace(pattLoad, "onDocLoaded();preContent={dom:"); //add onDocLoaded event that would otherwise never be called
                temp_edgeFile = temp_edgeFile + "\/\/updatePath:" + sourceFolderURL + "*";
                temp_edgeFile = temp_edgeFile + "\/\/modificationDate:" + mDate + "*";

                var scriptpatt = /scripts=\[([^\]]*)\]/;
                var checkAgain = scriptpatt.exec(temp_edgeFile);
                if(checkAgain && checkAgain.length > 1 && checkAgain[1] !== '') {
                    temp_edgeFile = edgeFile;
                    temp_edgeFile = temp_edgeFile.replace(/(var im=')[\S\s]*?'/g, "var im='images/'");
                    temp_edgeFile = temp_edgeFile.replace(/scripts=\[[^\]]*\]/, "scripts=\[\]");
                    temp_edgeFile = temp_edgeFile + "\/\/updatePath:" + sourceFolderURL + "*";
                    temp_edgeFile = temp_edgeFile + "\/\/modificationDate:" + mDate + "*";
                }

                if (DWfile.write(edgeURL, (" \/* Edited by Nemo *\/ " + temp_edgeFile) )) {
                    // start by announching it is edited.
                    //document.getElementById("status").innerHTML = "Loaded " + animationName;
                    //all is succesful. notify the extension
                    return toXML([{'name':'animation', 'val':animationName},{'name':'path', 'val':sourceFolderURL}]);
                } else {
                    //weird stuff happened
                    alert("Failed to import animation. Could not write the file.");
                    return toXML([{'name':'animation', 'val':"none"},{'name':'path', 'val':"none"}]);
                }
            }
        }

    }
    // None animation file is found; return
    animationFileURL = undefined;
    return toXML([{'name':'animation', 'val':"none"},{'name':'path', 'val':"none"}]);

}

function _importEdgeAnimation(animationName, isNewAnimation, absoluteSourceURL, absoluteRootURL, destFolderURL) {
    //
    //  It's time to copy the files!
    //
    DWfile.copy(absoluteSourceURL, destFolderURL + "/" + animationName + EDGEFILE); //copy all the Js files to that place
    var mDate = DWfile.getModificationDate(absoluteSourceURL);


    // Copy all the images to root/images
    var list = DWfile.listFolder(absoluteRootURL + "/images");
    if (list){
        var doTheSame = undefined;
        var didAnOverride = undefined;
        for(var j=0; j<list.length; j++) {
            var absoluteDestinationImageURL = dreamweaver.relativeToAbsoluteURL(dreamweaver.getDocumentPath("document"), FOLDERPATH, "/images/" + list[j]);
            if( isNewAnimation && DWfile.exists(absoluteDestinationImageURL) ) {
                if(doTheSame === undefined && didAnOverride !== undefined) {
                    doTheSame = confirm("Do you want to " + ( didAnOverride ? "override" : "ignore" ) + " all upcoming files?");
                }

                if(doTheSame && (didAnOverride !== undefined)) {
                    var overrideTheFile = didAnOverride;
                    if(!overrideTheFile) break;
                } else {
                    var overrideTheFile = confirm("The image " + list[j] + " already exists in your images directory. Would you like to override the file?");
                    didAnOverride = overrideTheFile;
                    if(!overrideTheFile) continue;
                }
            }
            //alert(absoluteRootURL + "/images/" + list[j]);
            DWfile.copy(absoluteRootURL + "/images/" + list[j], absoluteDestinationImageURL);
        }
    }


    //
    // Edit the preload file! Get the _edge.js file
    //
    var edgeURL = destFolderURL + "/" + animationName + EDGEFILE; // translate fileurl to edgeurl
    var edgeFile = DWfile.read(edgeURL);  // Read the edge file


    //
    //  Replace variables location
    //
    edgeFile.replace(/(var im=')[\S\s]*?'/g, "var im='images/'"); // original string = var im='animations/afbuigen_50/assets/images/'
    edgeFile = edgeFile.replace(/scripts=\[[^\]]*\]/, "scripts=\[\]"); // remove external scripts

    //
    //  Add some usefull info
    //
    //edgePreloadFile = edgePreloadFile.replace(pattLoad, "onDocLoaded();preContent={dom:"); //add onDocLoaded event that would otherwise never be called
    edgeFile = edgeFile + "\/\/updatePath:" + sourceFolderURL + "*";
    edgeFile = edgeFile + "\/\/modificationDate:" + mDate + "*";

    var result = DWfile.write(edgeURL, (" \/* Edited by Nemo *\/ " + edgeFile) );
    return result;
}

function assignAnimation(givenAnimation) {
    if(givenAnimation != "none" && givenAnimation !== undefined) {
        FOLDERPATH = nm.getFolderPath();
        var theDOM = dw.getDocumentDOM();
        //var tb = theDOM.getElementById("test");
        if (theDOM !== null) {
            var theNode   = theDOM.getSelectedNode();
            var oldAssign = theNode.id;
            var classList = theNode.class.split(" ");

            if(contains(classList, ANIMATIONCLASS)){ //select an animation container
                //theNode.setAttribute("url",encodeURIComponent(givenAnimation) );
                theNode.id = ANIMATIONCLASS + "_" + givenAnimation.replace(/^[_\d]*| /g, ""); //remove any digits and underscores in front of the first proper character. And any spaces.
                //open <givenAnimation>_edge.js, extract the height and width of the stage and assign it to the animationContainer
                var str = DWfile.read(FOLDERPATH + "animations/" + givenAnimation + "/" +givenAnimation + EDGEFILE);
                var str_cc = str && str.match(REGEX_COMPOSITIONCLASS);

                if(str !== undefined && str_cc !== undefined && str_cc.length > 3) {
                    var width, height, compositionclass;


                    // Not longer needed
                    // labels = str_labels[0].match(REGEX_LABEL);
                    // //tb.innerHTML += 'labels: ' + str_labels[0] + '..';
                    // if(labels !== undefined) {
                    //     var labels_str = '';
                    //     for(var m = 0; m < labels.length; m++) {
                    //         labels_str += labels[m].replace(/\"/g, "") + ',';
                    //     }
                    //     //tb.innerHTML += 'label_str: ' + labels_str;

                    //     if(labels_str !== '') {
                    //         theNode.setAttribute('data-labels', labels_str);
                    //     }
                    // }

                    compositionclass = str_cc[2];
                    theNode.setAttribute('class', compositionclass + ' ' + ANIMATIONCLASS);
                    theNode.setAttribute('data-name', givenAnimation);
                    theNode.setAttribute('data-compositionclass', compositionclass);
                    str = str.match(/\'\${Stage}\'[\s\S]*?\}/g); // Get Stage object
                    str = str && str[0];
                    str = str.match(/(r:)[\s]{0,}\[[\s\S]*?\]/g); // Get r object
                    str = str && str[0];
                    var result = str && str.match(/[0-9]{3,4}/g); // get sizes

                    if(result.length > 1) {
                        var end = result.length-1;
                        width = result[end-1];
                        height = result[end];

                        theNode.style.width = width + "px";
                        theNode.style.height = height + "px";
                        return toXML([{'name':'success', 'val':"true"}]);
                    }
                }

                alert("Animation is not assigned. The size of the stage could not be retrieved.");
                return toXML([{'name':'success', 'val':"false"}]);
            }else{
                alert("Please select an animation container from the stage.");
                return toXML([{'name':'success', 'val':"false"}]);
            }
        }else{
            alert("First, open a file.");
            return toXML([{'name':'success', 'val':"false"}]);
        }
    } else {
         alert("Please select an animation from the list.");
         return toXML([{'name':'success', 'val':"false"}]);
    }

}


function removeAnimation(givenName) {
    //on to the target folder
    if(!givenName) return;
    var folderURL = pathpatt.exec(dreamweaver.getDocumentPath("document"))[0] + "animations/" + givenName;
    var dom = dw.getDocumentDOM();
    var regex_aniname = new RegExp('\\b' + givenName + '\\b');

    //check if preload exists. if it does, remove it and notify the user that we're updating an older animation
    if(DWfile.exists(folderURL)){

        if (confirm("Are you sure you want to remove " + givenName + "?\n(" + folderURL + ")") ) {
            DWfile.remove(folderURL);
            var node = dom.getElementById(ANIMATIONCLASS + "_" + givenName);

            // Check for EdgeActions and remove actions (if the user wants to)
            var scriptnode = dom.getElementById('EdgeAnimationActions');
            var domActions;
            var new_actions;

            if(scriptnode) {
                var script = scriptnode.innerHTML;
                if(script !== undefined) eval(script);
                if(typeof EdgeAnimationActions === 'function') {
                    domActions = EdgeAnimationActions();
                }

                if(domActions) {
                    new_actions = domActions;
                    var removeActions = false;
                    var didIAsked = false;

                    for(var key in domActions) {
                        var elementlistArray = domActions[key].element;
                        if(elementlistArray && elementlistArray.length > 0) {
                            for(var i=0; i < elementlistArray.length; i++) {
                                var str = elementlistArray[i];
                                var checkAction = regex_aniname.test(str);
                                if(checkAction && !removeActions && !didIAsked) {
                                    if(confirm("Some actions are found in Edge Actions. Would you like to remove these? Yes is recommended.")) {
                                        removeActions = true;
                                    }
                                    didIAsked = true;
                                }

                                // Remove this action, if the user would like so
                                if(removeActions && checkAction) {
                                    var theelement = domActions[key].element;
                                    var thetargets = domActions[key].targets;
                                    var theactions = domActions[key].actions;

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
                        scriptnode.innerHTML = content;
                    }

                }
            }

            if(node !== undefined && confirm("Would you also remove the animation container from the stage?")) {
                node.outerHTML = ''; // remove node
            } else if(node !== undefined) {
                if(node.getAttribute('id')) node.removeAttribute('id');
                node.setAttribute('class', ANIMATIONCLASS);
                if(node.getAttribute('data-name')) node.removeAttribute('data-name');
            }
        }
    }
}

function automaticUpdateAnimations(animationNames, animationPaths) {
    if(!FOLDERPATH) FOLDERPATH = nm.getFolderPath();
    var listOfAnimations = animationNames.split(',');
    var listOfPaths = animationPaths.split(',');

    if(listOfAnimations.length === listOfPaths.length) {
        for(var i=0; i < listOfAnimations.length; i++) {
            var animationName = listOfAnimations[i];
            var animationPath = listOfPaths[i];

            var isPublishedSourceFolderURL = /publish\/web/.test(animationPath);
            if(!isPublishedSourceFolderURL) animationPath = animationPath + "/publish/web";
            var absoluteRootURL = dreamweaver.relativeToAbsoluteURL(dreamweaver.getDocumentPath("document"), FOLDERPATH, animationPath);
            var absoluteSourceURL = absoluteRootURL + '/' + animationName + EDGEFILE;

            var destFolderURL = FOLDERPATH + ANIMATIONSFOLDER + "/" + animationName;
            if(DWfile.exists(destFolderURL + "/" + animationName + EDGEFILE)) {
                destEdgeFile = DWfile.read(destFolderURL + "/" + animationName + EDGEFILE);
                var mPatt = /\/\/modificationDate:[^*]*/;

                var result = mPatt.exec(destEdgeFile);
                var destModificationDate = result && result[0].substring(19);
                var sourceModificationDate = DWfile.getModificationDate(absoluteSourceURL);
                var continueUpdating = false;
                if((destModificationDate && sourceModificationDate) && (destModificationDate !== sourceModificationDate)) {
                    continueUpdating = confirm('The animation ' + animationName + ' has been changed. Would you like to update the animation?');
                }

                if(continueUpdating) {
                    _importEdgeAnimation(animationName, false, absoluteSourceURL, absoluteRootURL, destFolderURL);
                }
            }

        }
    }
}