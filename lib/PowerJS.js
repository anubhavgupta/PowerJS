(function(){

    var
        store ={
            modules:{}
        },
        currentScope,
        self = this;

    /*
     store ={
             classes:{},
             injectables:{},
             namespace:{
                 SIMS:{
                     ACCESS:{
                               __ps__:{

                               }
                               class1: function(){};
                               class2: function(){};
                           }
                     }
             },
    * */


    this.getModel = function(){
        return store;
    };

    this.getScope = function(){
        return currentScope;
    };

    this.module = function(namespaceStr,scope){
        var str = namespaceStr.split(".");
        if(scope && typeof scope === "object"){
            currentScope = createNamespace(scope,0,str);
        }
        else{
            currentScope = createNamespace(store.modules,0,str);
        }
        return currentScope;
    };

})();

/*

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



*/
