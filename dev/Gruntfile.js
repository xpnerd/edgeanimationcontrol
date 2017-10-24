module.exports = function(grunt) {
    
   // This is the configuration.
   grunt.initConfig({
     concat: {
       options: {
         separator: '\n\n',
       },
       dist: {
         src: ['src/json-part_nmscripts.js', 'src/cust-part_nmscripts.js'],
         dest: 'dist/new_nmscripts.js',
       },
     },
   });
    
     // Load the plugin that provides the "concat" task.
     grunt.loadNpmTasks('grunt-contrib-concat');
    
     // Default task(s).
     grunt.registerTask('default', ['concat']);
   };