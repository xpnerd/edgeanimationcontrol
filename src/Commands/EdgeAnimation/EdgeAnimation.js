(function() {
  /* "use strict"; */

  /**
    * [EdgeAnimation is an EdgeAnimation object which refer to an EdgeAnimation]
   */
  var EdgeAnimation = function() {
    this.attrs = {
      "name" : "",                // the name of the EdgeAnimation
      "compclass" : "",           // the composition class of the EdgeAnimation
      "urlupdate" : "",           // the URL that points to the location with possible updates
      "moddate" : "",             // the modification date, this is in a special (unknown) format.
      "size" : [200, 200],        // the size, width and height respectively of ani
    };
    this.resources = {
      "images" : [],              // list of images filenames which are dependencies
    };
    this.path = {
      "absolute" : "",              // the relative-to-topic source filepathURL ../animations/src...
                                  // to .js file
      "relative" : "",            // the absolute source filepath URL      
      "dest" : "",                // the relative-to-topic dest filepathURL to .js file
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

    // published edge javascript files are named 'animationNAME_edge.js'
			var edgeJS = '_edge.js'; 
			var uniqueId = dwscripts.getUniqueId("nm_edgeanimation");
			var animationsFolder = 'animations_src';
			var folderPath = nm.getFolderPath();
			var activeSlide = nm.getCurrentSlide();
			// want to retrieve the folderName from the specified edgeAnimFolderURL (note '/' url-format)
			var REGEX_ANIMATIONNAME = /[^\/]*$/;
      // want to get absolute path of module parent folder, example: D:\...\parent_module_name\_web
      // presumed the edited .html is inside a `web`-folder
			var REGEX_NEMOWEBFOLDER = /(_web)[\s\S]*/;

			/**
			 * Retrieve the folder of an animation with the dialog box, edgeAnimFolderURL is global defined for potential use outside.
			 */
      this.path.absolute = this.getFolderPathBrowse(animationsFolder, REGEX_NEMOWEBFOLDER);
      if (this.path.absolute === '') return; // The user selected nothing, give option! so shut code down

			/**
			 * Check if there exists a publish folder in the animation folder by checking if "*_edge.js"-file exists.
			 * We exploit the standard Edge Animate folder file structure.
			 * 
			 * Edge Animation interest structure: "edgeAnimFolderURL/publish/web/edgeAnimName_edge.js"
			 *
			 * Due to the workings of Edge Animate 5.0.1 and 6.0.0 the names of file and folder coincide, see a sample folder for this phenomenen.
			 */
			edgeAnimName = REGEX_ANIMATIONNAME.exec(edgeAnimFolderURL);

			if (!DWfile.exists(edgeAnimFolderURL + '/publish/web/' + edgeAnimName + edgeJS)) {
				return "Make sure you selected the right folder, published (Ctrl+Alt+S) your animation and saved your Edge Animate file as a folder.";
			}

			/**
		  	* Check if there is an slide selected...
		  	*
		  	* Normally before it we Insert the image to the document.
		  	*/
			if (activeSlide != -1) {
				// get insertTag from function that handles the copying of the animation and files.
				// use dom... (see add image.htm as example)
			} else {
				return "Could not find the active slide. Please select a slide first.";
      }
      

  };

  EdgeAnimation.prototype.getFolderPathBrowse = function(startFolder, REGEX_ABS_URLPATH) {
    var docPath = dw.getDocumentPath('document'); // the same as dw.getDocumentDOM().URL
    var folderPath = nm.getFolderPath(docPath);
    var startURL = folderPath.replace(REGEX_ABS_URLPATH, '') + startFolder + '/';

    var absFolderPath = dw.doURLEncoding(dw.browseForFolderURL("Please select a folder.", startURL));

    // makes sure we have the absFolderPath
    absFolderPath = dw.relativeToAbsoluteURL(docPath, folderPath, absFolderPath);
    return absFolderPath;
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

