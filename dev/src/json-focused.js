/*
 * JSON
 * 
 * functions focused on JSON applications
 */

/**
 * Not documented yet.
 * @deprecated since version 2.2.0
 * @param {string} folderPath 
 */
function nemo_getConfigJSONFilePath(folderPath) {
    filepath = folderPath && (folderPath + 'properties.json');
    return filepath;
}

/**
 * Not documented yet.
 * 
 * @deprecated since version 2.2.0
 */
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

/**
 * Not documented yet.
 * @deprecated since version 2.2.0
 * @param {json} configJSON 
 */
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

/**
 * Not documented yet,
 * @deprecated since version 2.2.0
 */
function nemo_findItemInJSON(obj, item, group) {
    for (var j in obj) {
        var result = obj[j][group];
        if (result && result == item) {
            return j;
        }
    }
    return -1;
}

/**
 * Not documented yet.
 * @deprecated since version 2.2.0
 * @param {json} configjson 
 */
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