/**
 * Interface Class
 *
 * Creates an Interface
 *
 * @param interfaceName
 * @param module
 */
function $Interface(interfaceName,module){

    this._interfaceName = interfaceName;
    this._module = module;

    //defaults
    this._extendsTo = null;
}

$Interface.prototype = {

    $prototype:function(pObj){

    },

    $extends:function(iObj){
        if(iObj instanceOf $Interface){
            this._extendsTo = iObj;
        }
    }
}