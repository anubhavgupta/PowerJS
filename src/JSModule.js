/**
 * PowerJS module Implementation
 */
// add support for private modules too..
function JSModule(parentScope, moduleName) {
    this._$pjs_ = {
        _moduleName: moduleName,
        _$classData: {},
        _$injectables: {},
        _$parentModule: parentScope
    };
}

JSModule.prototype = {
    getCompleteModulePath:function(childModuleName){
        var completePath = childModuleName;

        if(childModuleName){
            completePath = this._$pjs_._moduleName+"."+completePath
        }
        else{
            completePath = this._$pjs_._moduleName;
        }

        if(this._$pjs_._$parentModule)
        {
            completePath = this._$pjs_._$parentModule.getCompleteModulePath(completePath);
        }

        return completePath;
    }
};

