module.exports = function(grunt) {
    
   // This is the configuration.
   grunt.initConfig({
     concat: {
       options: {
         separator: '\n\n',
       },
       dist: {
         src: ['src/json-part_nmscript.js', 'src/cust-part_nmscript'],
         dest: 'dist/allScripts.js',
       },
     },
   });
    
     // Load the plugin that provides the "concat" task.
     grunt.loadNpmTasks('grunt-contrib-concat');
    
     // Default task(s).
     grunt.registerTask('default', ['concat']);
   };