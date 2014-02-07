/*
 TODO:
 1) add class defination
 2) add class newing
 3) add basic inheritance
 4) add interfaces

 module.$Class("test").$define(function(){

 })

 new module.test()

 */

function $Class(className, module) {
    this._className = className;
    this._module = module;
    this._extendsTo = null;
}

$Class.prototype = {

    $define: function (defination) {
        this._module[this._className] = defination;
        var self =this;
        if(this._extendsTo){
            this._module[this._className] = function(){
                self._extendsTo.apply(this,arguments);//calls parent class function/constructor
                defination.apply(this,arguments) //attaches defination function body to this function.
            }
            this._module[this._className].prototype = new this._extendsTo();
            this._module[this._className].prototype.constructor = this._module[this._className];
        }
        return this._module[this._className];
    },

    $extends: function(classDefinition){
        this._extendsTo = classDefinition;
        return this;
    }

}




