//==========================================================
//  PowerJS                                            
//  Version: 0.1.1                                
//  Author:  Anubhav Gupta 
//  License: MIT  
//==========================================================



;(function(window){

/**
 * PowerJS Class
 *
 * @param className - Class Name
 * @param module    - JSModule
 */
function $Class(className, module) {

    this._className = className;
    this._module = module;
    this._constructor = function(){
        //empty constructor
    };

    //defaults
    this._extendsTo         = null;
    this._provides          = null;

    //helper methods
    this._resolveInjectableItems =function(){
        var injectableStrArr = this._provides;
        var injectableParams = [];

        for(var i=0;i<injectableStrArr.length;i++){
            var injectableItem = this._module._$pjs_._$injectables[injectableStrArr[i]];

            if(injectableItem instanceof $Injectable){
                if(injectableItem._isClass){
                    if(!injectableItem._injectable){
                        throw  new Error("Unable to Inject: "+injectableItem._name+" in "+this._className);
                    }
                    injectableItem._injectable = new injectableItem._injectable();
                    injectableItem._isClass = false;
                }
                injectableParams.push(injectableItem._injectable);
            }
            else{
                injectableParams.push(null);
            }
        }
        return injectableParams;
    }
}

$Class.prototype = {

    $constructor:function(constMethod){
        this._constructor = constMethod;
        return this;
    },

    $prototype:function(pObj){
        var
            _class,
            _parentClass,
            self = this;

        if(this._extendsTo){ //derived class

            _parentClass = function(){
                //empty Constructor class;
                //helps in newing without any fuzz...
            };
            _class = function(){
                this.$super = function(){}; //empty function
                if(self._provides){
                    arguments = self._resolveInjectableItems();
                }
                self._extendsTo.apply(this,arguments);  //call parent's constructor //apply with this prevent polluting base method's prototype
                self._constructor.apply(this,arguments); //call own constructor
            };

            _parentClass.prototype = this._extendsTo.prototype;
            _class.prototype = new _parentClass();
            _class.prototype.constructor = _class; // for instanceof comparison

            for(var meth in pObj){
                if(typeof  pObj[meth] === "function")
                {
                    _class.prototype[meth] = function(){
                        var methd = meth;
                        return function(){
                            this.$super = self._extendsTo.prototype[methd] || function(){};
                            var returnVal = pObj[methd].apply(this,arguments);
                            this.$super = function(){};
                            return returnVal;
                        }
                    }(); //auto execute to give it a new scope

                }
                else{  /// variable or object
                    _class.prototype[meth] = pObj[meth];  // copy variables too..
                }

            }

        }
        else{  //base class
            _class = function(){
                this.$super = function(){}; //empty super function for base class.
                if(self._provides){
                    arguments = self._resolveInjectableItems();
                }
                self._constructor.apply(this,arguments); //call own constructor
            };

            for(var prop in pObj){
                _class.prototype[prop]  = pObj[prop]; //copy vars and methods
            }

        }

        this._module[this._className] = _class;
        return this._module[this._className];
    },

    $extends: function(classDefinition){
        this._extendsTo = classDefinition;
        return this;
    },

    $provides:function(injectableStrArr){
        this._provides = injectableStrArr;
        return this;
    }

};


function $Injectable(name,isClass,injectable){
    this._injectable = injectable;
    this._isClass = isClass;
    this._name = name;
}

function JSModule(){
    this._$pjs_ = {
        _$classData:{},
        _$injectables:{}
    }
}

JSModule.prototype = {
    $Class:function(className){
        this._$pjs_._$classData[className] = new $Class(className,this);
        this[className] = function(){};
        return this._$pjs_._$classData[className];
    },
    $Injectable:function(name,isClass,injectable){
        this._$pjs_._$injectables[name] = new $Injectable(name,isClass,injectable);
    }
};
function createNamespace(scope,index,strArray){
    if(index >= strArray.length){
        return scope;
    }
    if(!scope[strArray[index]]){
        scope[strArray[index]] = new JSModule(); //creates a new JSModule Object
    }
    return createNamespace(scope[strArray[index]],++index,strArray);
}



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
    getModel = function(){
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
    module = function(namespaceStr,scope){
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
})(window)
