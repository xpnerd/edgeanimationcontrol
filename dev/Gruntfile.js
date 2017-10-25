module.exports = function (grunt) {

  // This is the configuration.
  grunt.initConfig({
    concat: {
      options: {
        separator: '\n\n',
      },
      dist: {
        src: ['src/json-part_nmscripts.js', 'src/cust-part_nmscripts.js'],
        dest: '../../../AppData/Roaming/Adobe/Dreamweaver CC 2014.1/en_US/Configuration/Shared/Nemo/new_nmscripts.js',//'dist/new_nmscripts.js',
      },
    },
    copy: {
      main: {
        files: [
          {expand: true, flatten: true, src: ['src/Commands/*'], dest: '../../../AppData/Roaming/Adobe/Dreamweaver CC 2014.1/en_US/Configuration/Commands/', filter: 'isFile'},

          {expand: true, flatten: true, src: ['src/Objects/Nemo/*'], dest: '../../../AppData/Roaming/Adobe/Dreamweaver CC 2014.1/en_US/Configuration/Objects/Nemo/', filter: 'isFile'},
        ],
      },
    },
  });

  // Load the plugin that provides the "concat" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'copy']);
};