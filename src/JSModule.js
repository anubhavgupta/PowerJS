/**
 * PowerJS module Implementation
 */

function JSModule(parentScope, moduleName) {
    this._$pjs_ = {
        _moduleName: moduleName,
        _$classData: {},
        _$injectables: {},
        _$parentModule: parentScope
    };
}



