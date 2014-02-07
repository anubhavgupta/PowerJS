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

function $Class(className,module){
    this._className = className;
    this._module = module;
}

$Class.prototype.$define = function(defination){
    this._module[this._className] = defination;
    return this._module[this._className];
};


