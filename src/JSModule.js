/**
 * PowerJS module Implementation
 */

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