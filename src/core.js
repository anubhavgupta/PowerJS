
    var
        store ={
            modules:{}
        },
        undefined = void 0;



    /*

        ^
        =
        =
        =
        |
        ^

     modules ={

             com:{
                 google:{
                           __pjs__:{
                               $classData:{},
                               $injectable:{}
                           }
                           class1: function(){};
                           class2: function(){};
                       }
                 }
     };
    * */


    /**
     * Return complete model structure.
     *
     * //>> As of right now for Debug only.
     *
     * @returns {{modules: {}}}
     */
    window.getModel = function(){
        return store;
    };


    /**
     * Creates a new module
     *
     * @param namespaceStr {String}             - complete package name eg: "com.google.search"
     *                                            this will return a module named "searched"
     * @param scope -{optional} {JSModule}      - module in which sub modules have to be created.
     * @returns {*}
     */
    window.module = function(namespaceStr,scope){
        var retModule;
        if(namespaceStr == undefined && scope ==undefined){      // for anonymous Classes
            retModule = new JSModule();
        }
        else{
            var str = namespaceStr.split(".");
            if(scope && scope instanceof JSModule){
                retModule = createNamespace(scope,0,str);
            }
            else{
                retModule = createNamespace(store.modules,0,str);
            }
        }

        return retModule;
    };


/*
 // ======================================================SOME IDEAS==============================================================================
var model       =   module("GRID.model");
var view        =   module("GRID.view");
var controller  =   module("GRID.controller");


model.$Class("Employee",function(){

    var employeeList = [];

    this.addEmployee = function(){};

    this.showAllEmployees = function(){};

    this.deleteAllemployees = function(){}

});

model.$Injectable("$Employee",{
    type:"new",//singleton,reference
    injectables:["$List,$Management"],
    params:[]
});

model.$Class
    .extend("SIMS.access.grid.Class1")
    .$Inject([])
    .define("name",function(){

    });

model.$Class.define("className",function(){
    this.method = function(){

        //alternate way to define classes/

    }
});

*/
/*javascript bean classes......*//*



model.$Class
    .$Annotate(test="sdasdasd")
    .$Implements("NJS.Bean")
    .define("beanName", function () {
        var
            name,
            place;

        this.getName = function (name) {
            return name;
        };

        this.setName = function () {
            name = name;
        };

        this.setPlace = function (place) {
            place = place;
        };

        this.getPlace = function () {
            return place;
        }

    });

 // ======================================================SOME IDEAS==============================================================================

*/
