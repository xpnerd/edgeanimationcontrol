// Has to be loaded together with new_nmscripts and NM_test.htm dreamweaver.popupCommand("NM_test.htm"); should be called by an Inspector if possible.
var SELECT_ANIME = new ListControl('listAnimations');

function getAlert() {
    var i = document.myForm.mySelect.selectedIndex;
    if (i >= 0) {
        alert("Selected index: " + i + "\n" + "Selected text " + document.myForm.mySelect.options[i].text);
    } else {
        alert("Nothing is selected" + "\n" + "or you entered a value\nspecial value i: " + i);
    }
}

function updateUI() {

}

function showValue() {
    var value = parseInt(SELECT_ANIME.getValue());

    alert(value);
}

function delAnimations() {

    // made because of bug in .del() which deletes the wrong items from a list, since splicing makes the list smaller but this is not handled in the list containing this info.
    var object_options = SELECT_ANIME.object.options;
    var list_index_int = [];
    var list_label_str = SELECT_ANIME.get('multiple');

    if (confirm("Are you sure you want to delete/remove all selected animations?\n" + list_label_str.join("\n"))) {
        for (var i = 0; i < object_options.length; i++) {
            if (object_options[i].selected){
                alert(list_label_str[i]);
            }
            
                        // it is buggy here (it deletes too much)
                        
            /* if (object_options[i].selected) {
                SELECT_ANIME.del(i);
                break;
            } */
        }
        SELECT_ANIME.del();
        // It auto updates, hidden in .del()!
    }

    /**
     * Private function that deletes one item, which makes the objects_options list smaller, 
     * thus keeping track of the changing index. This cannot be done otherwise, since .del() resets to the first element.
     * 
     */
    function deleteItem() {
        
    }
}

function dispAnimations(list_animations) {
    var list_names_str = list_animations.map(function (animation) { return animation.name; });
    var list_index_val = [];

    for (var i = 0; i < list_names_str.length; i++) {
        var temp_str = list_names_str[i];

        if (temp_str.length > 10) {
            list_names_str[i] = temp_str.slice(0, 9) + "...";
        }

        list_index_val.push(i);
    }

    SELECT_ANIME.setAll(list_names_str, list_index_val);
}

function getObjects() {
    var list_objects = [];
    var names = ["dumb", "dumber", "doo", "durp"];

    for (var i = 0; i < names.length; i++) {
        list_objects.push(new testobject(names[i]));
    }
    return list_objects;
}

var testobject = (function () {

    var symbol = function (name) {
        this.name = name;
    };

    symbol.prototype.callName = function () {
        alert("This is my name: " + this.name);
    }

    return symbol;
})();