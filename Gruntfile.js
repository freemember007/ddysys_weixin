module.exports = function (grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // 仅build时用到的任务
    concat: {
      build: {
        files: {
          'build/js/app.js': ['src/**/*.js', '!src/lib/*.js'],
          'build/js/lib.js': ['src/lib/*.js']
        }
      }
    },
    sass: {
      build: {
        options: {
          noCache: true,
          quiet: true
        },
        files: {
          'build/css/style.css': 'src/scss/style.scss',
          'build/css/ionic.css': 'src/scss/ionic/ionic.scss'
        }
      }
    },
    html2js: {
      options: {
        htmlmin: {
          // collapseBooleanAttributes: true,
          collapseWhitespace: true,
          // removeAttributeQuotes: true,
          removeComments: true,
          // removeEmptyAttributes: true,
          // removeRedundantAttributes: true,
          // removeScriptTypeAttributes: true,
          // removeStyleLinkTypeAttributes: true
        }
      },
      build: {
        src: ['src/**/*.html'],
        dest: 'build/js/templates.js'
      }
    },

    // 仅release时用到的任务
    uglify: {
      release: {
        options: {
          // report: 'gzip'
        },
        files: [
          {expand: true, cwd: 'build/js', src: ['*.js'], dest: 'release/js', ext: '.js'}
        ]
      }
    },
    cssmin: {
      release: {
        files: [
          {expand: true, cwd: 'build/css', src: ['*.css'], dest: 'release/css', ext: '.css'}
        ]
      }
    },
    cacheBust: {
      options: {
        baseDir: 'release/',
        assets: ['*/*.{js,css,png,jpg,gif,ico,eot,svg,ttf,woff}'],
        queryString: true,
        length: 8
      },
      release: {
        files: [{
          cwd: 'release/',
          src: ['index.html']
        }]
      }
    },

    // build和release都会用到的任务
    copy: { // 注意:此任务应在cacheBust任务前执行
      build: {
        files: [
          {expand: true, cwd: 'src', src: ['{fonts,img}/*', 'index.html'], dest: 'build'}
        ]
      },
      release: {
        files: [
          {expand: true, cwd: 'build', src: ['{fonts,img}/*', 'index.html'], dest: 'release'}
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: '*',
        livereload: 35729
      },
      build: {
        options: {
          open: false, //自动打开网页 http://
          base: [
            './build' //主目录
          ]
        }
      },
      release: {
        options: {
          open: true, //自动打开网页 http://
          base: [
            './release' //主目录
          ]
        }
      }
    },
    watch: {
      concat: {
        files: ['src/**/*.js'],
        tasks: ['concat']
      },
      sass: {
        files: ['src/**/*.scss'],
        tasks: ['sass']
      },
      html2js: {
        files: ['src/**/*.html'],
        tasks: ['html2js']
      },
      copy: {
        files: ['src/fonts/*.*', 'src/img/*.*'],
        tasks: ['copy']
      },
      livereload: {
        options: {
          livereload: '<%=connect.options.livereload%>' //监听前面声明的端口  35729
        },
        files: [ //下面文件的改变就会实时刷新网页
          '{build,release}/**'
        ]
      }
    },

    // clean
    clean: {
      options: {
        'no-write': false
      },
      build: ['build'],
      release: ['release']
    }

  });


  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass'); // todo:执行速度貌似比grunt-sass慢
  grunt.loadNpmTasks('grunt-common-html2js');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-cache-bust');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('build', ['concat', 'sass', 'html2js', 'copy:build',  'connect:build', 'watch']);
  // 注意:此任务执行的前提是build任务执行
  grunt.registerTask('release', ['copy:release', 'uglify', 'cssmin', 'cacheBust', 'connect:release', 'watch']);

};