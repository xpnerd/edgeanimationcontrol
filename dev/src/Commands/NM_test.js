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

function showValue(){
    var value = parseInt(SELECT_ANIME.getValue());

    alert(value);
}

function delAnimations(){
    var list_index_str = SELECT_ANIME.getValue('multiple');
    var list_label_str = SELECT_ANIME.get('multiple');
    var list_index_int = [];

    if (confirm("Are you sure you want to delete/remove all selected animations?\n" + list_label_str.join("\n"))){
        for (var i = 0; i < list_index_str.length; i++) {
        var element = parseInt(list_index_str[i]);

        if (!isNaN(element)) {
            list_index_int[i] = element;
        } else {
            alert("Unexpect ERROR: value is NaN");
        }
        
        // it is buggy here (it deletes too much)
        SELECT_ANIME.del();
    }
    // It auto updates, hidden in .del()!
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