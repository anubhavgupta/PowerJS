/**
 * PowerJS
 * Developed by: Anubhav Gupta
 * Licence: MIT
 * Link: https://github.com/anubhavgupta/PowerJS
 */

(function(){

    var
        store ={
            modules:{}
        },
        currentScope,
        self = this;


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
        this._extendsTo = null;
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
                    //no Constructor class;
                    //helps in newing without any fuzz...
                };
                _class = function(){
                    this.$super = function(){}; //empty function
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

                }

            }
            else{  //base class
                _class = this._constructor;
                _class.prototype  = pObj;
                _class.prototype.$super = function(){}; //empty super function for base class.
            }

            this._module[this._className] = _class;
            return this._module[this._className];
        },

        $extends: function(classDefinition){
            this._extendsTo = classDefinition;
            return this;
        }

    };



    /**
     * PowerJS module Implementation
     */
    function JSModule(){
        this._$pjs_ = {
            $classData:{},
            $injectables:{}
        }
    };

    JSModule.prototype = {
        $Class:function(className){
            this._$pjs_.$classData[className] = new $Class(className,this);
            this[className] = function(){};
            return this._$pjs_.$classData[className];
        }
    };

    /**
     * Creates a object store inside the passed object
     * for a given string array.
     *
     * @param scope
     * @param index
     * @param strArray
     * @returns {object} - final scope object
     */
    function createNamespace(scope,index,strArray){
        if(index >= strArray.length){
            return scope;
        }
        if(!scope[strArray[index]]){
            scope[strArray[index]] = new JSModule(); //creates a new JSModule Object
        }
        return createNamespace(scope[strArray[index]],++index,strArray);
    }






    /**
     * Return complete model structure.
     *
     * //>> As of right now for Debug only.
     *
     * @returns {{modules: {}}}
     */
    this.getModel = function(){
        return store;
    };

    /**
     * returns Last created module.
     *
     * @returns {JSModule}
     */
    this.getScope = function(){
        return currentScope;
    };

    /**
     * Creates a new module
     *
     * @param namespaceStr {String}             - complete package name eg: "com.google.search"
     *                                            this will return a module named "searched"
     * @param scope -{optional} {JSModule}      - module in which sub modules have to be created.
     * @returns {*}
     */
    this.module = function(namespaceStr,scope){
        var str = namespaceStr.split(".");
        if(scope && scope instanceof JSModule){
            currentScope = createNamespace(scope,0,str);
        }
        else{
            currentScope = createNamespace(store.modules,0,str);
        }
        return currentScope;
    };

})();

