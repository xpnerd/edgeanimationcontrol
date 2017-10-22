module.exports = function(grunt) {
    
   // This is the configuration.
   grunt.initConfig({
     concat: {
       options: {
         separator: '\n\nMake sure to uncomment stuff in:\nnemo_isValidAnimeFolder\ngetParentFolderPath',
       },
       dist: {
         src: ['src/json-part_nmscript.js', 'src/cust-part_nmscript.js'],
         dest: 'dist/new_nmscripts.js',
       },
     },
   });
    
     // Load the plugin that provides the "concat" task.
     grunt.loadNpmTasks('grunt-contrib-concat');
    
     // Default task(s).
     grunt.registerTask('default', ['concat']);
   };