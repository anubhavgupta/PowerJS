/*
 TODO:
 1) add class definition        [Done]
 2) add class newing            [Done]
 3) add basic inheritance       [Done]
 4) add Injectable and provider [Done]
 4) add interfaces

 */
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

