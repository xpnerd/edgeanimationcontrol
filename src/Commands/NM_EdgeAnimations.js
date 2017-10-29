//SHARE-IN-MEMORY=true

// NOTICE: dependent on the 'nmscripts.js' by default !
var text_length = 13;   // Maximum shown (name) text length
var SELECT_ANIME;       // Control List of available animations, which after initUI() can grow and shrink in length.
var list_animations;    // List of EdgeAnimation objects, which after initUI() can only grow.

/**
 * Is the first function that is called when EdgeAnimation pop-up Command Menu is opened.
 * It initiates <tt>list_animations</tt> and <tt>SELECT_ANIME</tt>.
 */
function initUI() {
    // "https://stackoverflow.com/questions/19590865/from-an-array-of-objects-extract-value-of-a-property-as-array"
    // Since this is called we set all (global variable) paths to the current document.
    nm.initPaths();

    SELECT_ANIME = new ListControl('listAnimations');
    list_animations = nm.getEdgeAnimations();
    dispAnimations(list_animations);
}

/**
 * Sets all the initial values of <tt>SELECT_ANIME</tt> based on our given objects.
 * @param {Object} list_animations - List of EdgeAnimation objects 
 */
function dispAnimations(list_animations) {
    var list_names_str = list_animations.map(function (animation) {
        if (animation instanceof EdgeAnimation) {
            return animation.name.file;
        } else {
            return "ERROR: not Edge file";
        }
    });
    var list_index_val = [];

    for (var i = 0; i < list_names_str.length; i++) {
        var temp_str = list_names_str[i];

        if (temp_str.length > text_length) {
            list_names_str[i] = temp_str.slice(0, text_length) + "...";
        }

        list_index_val.push(i);
    }

    SELECT_ANIME.setAll(list_names_str, list_index_val);
}

/**
 * Adds an animation to the list of animations and inserts it into the current DOM (slide).
 * Moreover the index of location in <tt>list_animations</tt> is given as value in <tt>SELECT_ANIME</tt>.
 */
function addAnimation() {
    var edge_animation = nm.addEdgeAnimation();

    if (edge_animation) {
        list_animations.push(edge_animation);
        SELECT_ANIME.add(edge_animation.name.file, list_animations.length);
    } else {
        // alert('Unexpected ERROR: failed to add Animation');
    }

    window.close();
}

/**
 * Inserts an Animation into the curren DOM (slide).
 */
function insertAnimation(){
    var list_index_val = SELECT_ANIME.getValue('multiple');

    if (list_index_val.length === 1) {
        var edge_animation = list_animations[parseInt(list_index_val)];
        nm.insertTag(edge_animation.getDivTag(), edge_animation.attributes.id);
    } else {
        alert("Please select only one animaton for insertion.");
    }

    window.close();
}

/**
 * Updates the selected animations.
 */
function updateAnimations(){
    var list_index_val = SELECT_ANIME.getValue('multiple');

    for (var i=0; i < list_index_val.length; i++) {
        nm.updateEdgeAnimation(list_animations[parseInt(list_index_val[i])]);
    }
}

/**
 * Change/Assign the info of the current (animation) div-container with the selected
 * animation from the <tt>list_animations</tt>.
 */
function changeAnimation() {
    var dom = dw.getDocumentDOM();

    if (nm.isValidAnimeDiv(dom)) {
        var list_index_val = SELECT_ANIME.getValue('multiple');

        if (list_index_val.length === 1) {
            var index = parseInt(list_index_val);
            nm.changeEdgeAnimation(list_animations[index], dom);
        } else {
            alert("Please select only one animation for changing/re-assigning to a container.");
        }
    } else {
        alert("Please select a valid animation div-container");
    }

    window.close();
}

/**
 * Deletes/Removes the (multiple) selected animations from <tt>SELECT_ANIME</tt>
 * and from the animation folder, but NOT from list_animations.
 */
function delAnimations() {
    var list_index_val = SELECT_ANIME.getValue('multiple');
    var list_label_str = SELECT_ANIME.get('multiple');

    if (confirm("Are you sure, to delete/remove all selected animations?\n" + list_label_str.join("\n"))) {
        for (var i = 0; i < list_index_val.length; i++) {
            var edge_animation = list_animations[parseInt(list_index_val[i])];

            nm.delEdgeAnimation(edge_animation);
        }

        SELECT_ANIME.del();
    }
}