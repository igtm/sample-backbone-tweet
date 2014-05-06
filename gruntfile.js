module.exports = function(grunt) {
  grunt.initConfig({
    connect: {
      livereload: {
        options: {
          port: 9001
        }
      }    },
    watch: {
      files: ['./*.html','./*.js'],
      options: {
          livereload: true,
          spawn: false
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['connect','watch']);
};