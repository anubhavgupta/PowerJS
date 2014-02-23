/*
 TODO:
 1) add class definition    [Done]
 2) add class newing        [Done]
 3) add basic inheritance   [Done]
 4) add interfaces

 module.$Class("test").$define(function(){

 })

 new module.test()

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
                    }();

                }

            }

            //_class.prototype.$super = self._extendsTo.prototype; //super
            /*_class.prototype.$super = function(){
                var $parent = ;
            }*/
        }
        else{  //base class
            _class = this._constructor;
            _class.prototype  = pObj;
            _class.prototype.$super = {};
        }

        this._module[this._className] = _class;
        return this._module[this._className];
    },


    /*$define: function (defination) {
        this._module[this._className] = defination;
        var self =this;
        if(this._extendsTo){
            this._module[this._className] = function(){
                self._extendsTo.apply(this,arguments);//calls parent class function/constructor
                defination.apply(this,arguments) //attaches definition function body to this function.
            }
            this._module[this._className].prototype = new this._extendsTo();
            this._module[this._className].prototype.constructor = this._module[this._className];
        }
        return this._module[this._className];
    },*/

    $extends: function(classDefinition){
        this._extendsTo = classDefinition;
        return this;
    }

};

