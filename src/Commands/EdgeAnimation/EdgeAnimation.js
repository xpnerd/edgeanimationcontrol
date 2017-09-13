(function() {
  "use strict";

  /**
    * [EdgeAnimation is an EdgeAnimation object which refer to an EdgeAnimation]
   */
  var EdgeAnimation = function() {
    this.attrs = {
      "name" : "",                // the name of the EdgeAnimation
      "compclass" : "",           // the composition class of the EdgeAnimation
      "size" : [200, 200],        // the size, width and height respectively of ani
    };
    this.resources = {
      "images" : [],              // list of images filenames which are dependencies
    };
    this.path = {
      "source" : "",              // the relative-to-topic source filepathURI ../animations/src...
                                  // to .js file
      "dest" : "",                // the relative-to-topic dest filepathURI to .js file
    };
    this.DOMId = "";              // the id-attribute of the DOMNode of the EdgeAnimation

  };

  /**
   * initFromDOMNode initializes the EdgeAnimation object based on the 
   * information specified in 
   * @param  {[type]} EdgeAnimationDOMNode [description]
   * @return {[type]}                      [description]
   */
  EdgeAnimation.prototype.initFromDOMNode = function(EdgeAnimationDOMNode) {

  };

  EdgeAnimation.prototype.initFromFilePath = function(filepathURI) {
    // the filepathURI is delivered by the NM_EdgeAnimation object, with
    // help of a browse-for-file window. The script returns an absolute
    // path URI to the EdgeAnimation javascript file, for example:
    // "file:///D:/NM1234/animations_src/bloem/bloem_edge.js"
  };


  /**
   * getDataFromAnimationFile description
   * @return {[type]} [description]
   */
  EdgeAnimation.prototype.getDataFromAnimationFile = function(datastr) {
    // Use regular expressions to get the desired data from the animation file
    // Things which are important and are:
    // - name
    // - filename and filepath
    // - composition class
    // - width and length
    // - images list
    // - location of images whithin the published directory in /animations_src
    // - 
    // 
    // Look in the OLD NemoNavigator for the Nemo.jsx file for regelar expressoins
    // Train yourself with help of the website: https://regexr.com/
  };


  /**
   * [getDataFromAnimationFile description]
   * @return {[type]} [description]
   */
  EdgeAnimation.prototype.readAnimationFile = function(filepathURI) {
    // Use DWfile.read and DWfile.exists in a try catch block to 
    // prevent triggering of errors
  };


  /**
   * isModified returns true if the source file of the animation is
   * modified.
   * @return {Boolean}  Returns true if the source file is modified. False 
   *                    otherwise.
   */
  EdgeAnimation.prototype.isModified = function() {

  };


  /**
   * copyResources copies all dependencies of the EdgeAnimation from the 
   * source foler (e.g. /animations_src/bloem/) to the destination folder
   * (e.g. /_web/animations/bloem/). The files include the 'bloem_edge.js'
   * file, and all images (and possible other deps such as scripts!)
   * @return {[type]} [description]
   */
  EdgeAnimation.prototype.copyResources = function() {

  };

  // puur voor testen!
  if(global) {
    global.EdgeAnimation = EdgeAnimation;
  }

})();

