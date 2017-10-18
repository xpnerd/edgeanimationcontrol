// wat node rambam
require("./dreamweaverFile");
//require("../src/Commands/EdgeAnimation/EdgeAnimation");
require("../dev/nm-edgeanimation");
require("../dev/nm-file");
require("../dev/nm-file");
var dreamweaverDOM = require("./dreamweaverDOM");


var dom = dreamweaverDOM("topic/_web/mo_2013_10_vermogensmarkt.html");

console.log(dom.getTitle());


var edgeNode = dom.getElementById("EdgeAnimation_vermogen_10");
var edgeAnimation = new EdgeAnimation();
edgeAnimation.initFromDOMNode(edgeNode);

