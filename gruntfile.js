module.exports = function(grunt){

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),
        dirs: {
            src: 'src',
            module:"<%= dirs.src%>/modules",
            dest: 'dist/<%= pkg.version %>'
        },
        concat:{
            options:{
                stripBanners:true,
                banner:"//==========================================================\n"+
                       "//  <%= pkg.name%>                                            \n"+
                       "//  Version: <%= pkg.version%>                                \n"+
                       "//  Author:  <%= pkg.author%> \n"+
                       "//  License: <%= pkg.license%>  \n"+
                        "//==========================================================\n\n\n\n"+
                       ";(function(window){\n'use strict';\n\n",
                footer:"})(window)\n;"
            },
            dist:{
                src:[
                    "<%= dirs.module%>/Class.js",
                    "<%= dirs.module%>/Injectable.js",
                    "<%= dirs.src%>/JSModule.js",
                    "<%= dirs.src%>/nameSpaceCreator.js",
                    "<%= dirs.src%>/core.js"
                ],
                dest:"<%= dirs.dest%>/PowerJS.js",
                nonull:true
            },
            latest:{
                src:[
                    "<%= dirs.module%>/Class.js",
                    "<%= dirs.module%>/Injectable.js",
                    "<%= dirs.src%>/JSModule.js",
                    "<%= dirs.src%>/nameSpaceCreator.js",
                    "<%= dirs.src%>/core.js"
                ],
                dest:"dist/latest/PowerJS.js",
                nonull:true
            },
            inBin:{
                src:[
                    "<%= dirs.module%>/Class.js",
                    "<%= dirs.module%>/Injectable.js",
                    "<%= dirs.src%>/JSModule.js",
                    "<%= dirs.src%>/nameSpaceCreator.js",
                    "<%= dirs.src%>/core.js"
                ],
                dest:"bin/PowerJS.js",
                nonull:true
            }
        },
        karma:{
            unit:{
                configFile: 'karma.config.js'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks("grunt-karma");

    grunt.registerTask("default",["concat","karma:unit"]);
    //grunt.registerTask("default",["karma:unit"]);


};