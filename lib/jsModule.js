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
    }/*,

    $Interface:function(interfaceName){
        this._$pjs_.$classData[interfaceName] = new $Interface(interfaceName,this);
        this[interfaceName] = {};
        return this._$pjs_.$classData[interfaceName];
    }*/



        /*function (name,injectableArr,meth) {
        if(typeof injectableArr === "function"){
            this.classes[name] = {
                meth:injectableArr
            }
        }
        else if(typeof injectableArr === "array" && typeof meth === "function"){
            this.classes[name] = {
                injectableArr:injectableArr,
                meth:meth
            }
        }
        else throw new Error("INVALID PARAMETER TYPES");

    }*/

};
