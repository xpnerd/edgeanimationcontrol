module.exports = function (grunt) {

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
    copy: {

    },
  });

  // Load the plugin that provides the "concat" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'copy']);
};