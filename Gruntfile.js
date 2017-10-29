module.exports = function (grunt) {

  // This is the configuration.
  grunt.initConfig({
    concat: {
      options: {
        separator: '\n\n',
      },
      dist: {
        src: ['src/1-json-main.js', 'src/2-global-focused.js', 'src/3-general-focused.js', 'src/4-file-focused.js', 'src/5-folder-focused.js', 'src/6-slides-focused.js','src/7-json-focused.js', 'src/8-animation-focused.js'],
        dest: '../../AppData/Roaming/Adobe/Dreamweaver CC 2014.1/en_US/Configuration/Shared/Nemo/nmscripts.js',//'dist/new_nmscripts.js',
      },
    },
    copy: {
      main: {
        files: [
          {expand: true, flatten: true, src: ['src/Commands/*'], dest: '../../AppData/Roaming/Adobe/Dreamweaver CC 2014.1/en_US/Configuration/Commands/', filter: 'isFile'},

          {expand: true, flatten: true, src: ['src/Objects/Nemo/*'], dest: '../../AppData/Roaming/Adobe/Dreamweaver CC 2014.1/en_US/Configuration/Objects/Nemo/', filter: 'isFile'},

          {expand: true, flatten: true, src: ['src/ListControlClass.js'], dest: '../../AppData/Roaming/Adobe/Dreamweaver CC 2014.1/en_US/Configuration/Shared/Nemo/'},

          {expand: true, flatten: true, src: ['src/Inspectors/NM_EdgeAnimation.htm'], dest: '../../AppData/Roaming/Adobe/Dreamweaver CC 2014.1/en_US/Configuration/Inspectors/', filter: 'isFile'},
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