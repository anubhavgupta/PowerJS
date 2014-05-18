//==========================================================
//  PowerJS                                            
//  Version: 0.2.3                                
//  Author:  Anubhav Gupta 
//  License: MIT  
//==========================================================



;(function(window){
'use strict';

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
            self = this,

        //helper methods
            _getInjectableItem = function(itemName){
                var module = self._module;
                var injectableItem = module._$pjs_._$injectables[itemName];
                while(!(injectableItem instanceof $Injectable) && module._$pjs_._$parentModule){
                    module  =   module._$pjs_._$parentModule;
                    injectableItem = module._$pjs_._$injectables[itemName];
                }

                return injectableItem;
            },
            _resolveInjectableItems = function(){

                var injectableStrArr = self._provides;
                var injectableParams = [];

                for(var i=0;i<injectableStrArr.length;i++){
                    var injectableItem = _getInjectableItem([injectableStrArr[i]]);

                    if(injectableItem._isClass){
                        if(injectableItem._injectable == undefined){
                            console.error("Unable to Inject: "+injectableItem._name+" in "+self._className);
                            throw  new Error("Unable to Inject: "+injectableItem._name+" in "+self._className);
                        }
                        injectableItem._injectable = new injectableItem._injectable();
                        injectableItem._isClass = false;
                    }

                    injectableParams.push(injectableItem._injectable);

                }
                return injectableParams;
            };

        if(this._extendsTo){ //derived class

            _parentClass = function(){
                //empty Constructor class;
                //helps in newing without any fuzz...
            };
            _class = function(){
                var args = arguments;
                this.$super = function(){}; //empty function
                if(self._provides){
                    args = _resolveInjectableItems();
                }
                self._extendsTo.apply(this,args);  //call parent's constructor //apply with this prevent polluting base method's prototype
                self._constructor.apply(this,args); //call own constructor
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
                var args =arguments;
                this.$super = function(){}; //empty super function for base class.
                if(self._provides){
                    args = _resolveInjectableItems();
                }
                self._constructor.apply(this,args); //call own constructor
            };

            /*for(var prop in pObj){
             _class.prototype[prop]  = pObj[prop]; //copy vars and methods
             }*/
            _class.prototype  = pObj; //copy vars and methods via ref.

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

function JSModule(parentScope){
    this._$pjs_ = {
        _$classData:{},
        _$injectables:{},
        _$parentModule:parentScope
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
        scope[strArray[index]] = new JSModule(scope); //creates a new JSModule Object
    }
    return createNamespace(scope[strArray[index]],++index,strArray);
}



    var
        store ={
            modules:{}
        },
        undefined = void 0,
        ERROR_STRINGS = {
            TYPE_STRING:"Expected String Type.",
            INSTANCE_JSMODULE:"Expected instanceof JSModule."
        };


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
        if(namespaceStr === undefined && scope === undefined){      // for anonymous Classes
            retModule = new JSModule();
        }
        else{
            if(typeof namespaceStr !="string"){
                throw new Error(ERROR_STRINGS.TYPE_STRING);
            }
            var str = namespaceStr.split(".");
            if(scope !== undefined){
                if(!(scope instanceof JSModule)){
                    throw new Error(ERROR_STRINGS.INSTANCE_JSMODULE);
                }
                retModule = createNamespace(scope,0,str);
            }
            else{
                retModule = createNamespace(store.modules,0,str);
            }
        }

        return retModule;
    };
})(window)
;