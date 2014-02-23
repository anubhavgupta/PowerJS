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
            self = this;

        if(this._extendsTo){
            _class = function(){
                self._extendsTo.apply(this,arguments);  //call parent's constructor
                self._constructor.apply(this,arguments); //call own constructor
            };
            var _parentClass = function(){
                //no Constructor class;
            };
            _parentClass.prototype = this._extendsTo.prototype;
            _class.prototype = new _parentClass();
            for(var meth in pObj){
                _class.prototype[meth] =  pObj[meth];
            }
            _class.prototype.$super = function(methName,argsArray){
                self._extendsTo.prototype[methName](argsArray);
            };
        }
        else{
            _class = this._constructor;
            _class.prototype  = pObj;
            _class.prototype.$super = function(){};
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

