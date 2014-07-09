//==========================================================
//  PowerJS                                            
//  Version: 0.4.4                                
//  Author:  Anubhav Gupta 
//  License: MIT  
//  Link: https://github.com/anubhavgupta/PowerJS.git  
//==========================================================



;(function(window){
'use strict';

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

        if(this._$pjs_._$parentModule &&  this._$pjs_._$parentModule._$pjs_._moduleName)
        {
            completePath = this._$pjs_._$parentModule.getCompleteModulePath(completePath);
        }

        return completePath;
    }
};





function createNamespace(scope,index,strArray){
    if(index >= strArray.length){
        return scope;
    }
    if(!scope[strArray[index]]){
        scope[strArray[index]] = new JSModule(scope,strArray[index]); //creates a new JSModule Object
    }
    return createNamespace(scope[strArray[index]],++index,strArray);
}



    var
        store ={
            modules:new JSModule(null,"."),//root scope
            plugins:{}
        },
        undefined = void 0,
        ERROR_STRINGS = {
            TYPE_STRING:"Expected String Type.",
            INSTANCE_JSMODULE:"Expected instanceof JSModule."
        };

    var getJSModule = function(){
        return JSModule;
    };


    /**
     * Return complete model structure.
     *
     * //>> As of right now for Debug only.
     *
     * @returns {{modules: {}}}
     */
    window.getModel = function(){
        return store;
    };


    /**
     * Creates a new module
     *
     * @param namespaceStr {String}             - complete package name eg: "com.google.search"
     *                                            this will return a module named "searched"
     * @param scope -{optional} {JSModule}      - module in which sub modules have to be created.
     * @returns {*}
     */
    window.module = function(namespaceStr,scope){
        var retModule;
        if(namespaceStr === undefined && scope === undefined){      // for anonymous Classes
            retModule = new JSModule();
        }
        else{
            if(typeof namespaceStr !="string"){
                throw new Error(ERROR_STRINGS.TYPE_STRING);
            }
            var str = namespaceStr.split(".");
            if(scope !== undefined){
                if(!(scope instanceof JSModule)){
                    throw new Error(ERROR_STRINGS.INSTANCE_JSMODULE);
                }
                retModule = createNamespace(scope,0,str);
            }
            else{
                retModule = createNamespace(store.modules,0,str);
            }
        }

        return retModule;
    };

    //------------------------------------------ PLUGIN INTERFACE  ----------------------------------------//

    function $Plugin(pluginName,plugins){
        this._pluginName = pluginName;
        this._dependencies = null;
        this._plugins = plugins;
        this.plugin= null; //stores the returned function/constructor
    }

    $Plugin.prototype = {
        $provides:function(pluginNameArr){
            this._dependencies = pluginNameArr;
            return this;
        },
        $create:function(meth){
            var resolvedDependencies = [];
            if(this._dependencies && this._dependencies.length){
                for(var i=0;i<this._dependencies.length;i++){
                    resolvedDependencies[i] = this._plugins[this._dependencies[i]].plugin.prototype;
                }
            }

            this.plugin = meth.apply(this,resolvedDependencies);
        }
    };

    /**
     * Helps creating a PowerJS plugin.
     * Expects a plugin name, which can be used later as an injectable item in Plugin's "provide".
     *
     * @param pluginName - name of PowerJS plugin
     * @returns {$Plugin}
     */
    module.$Plugin = function(pluginName){
        store.plugins[pluginName] = new $Plugin(pluginName,store.plugins);
        return store.plugins[pluginName];
    };


    //default JSModule plugin aliases
    module.$Plugin("JSModule").$create(getJSModule);
    module.$Plugin("$Module").$create(getJSModule);
    module.$Plugin("Module").$create(getJSModule);
    module.$Plugin("module").$create(getJSModule);

/**
 * PowerJS Class
 *
 * @param className - Class Name
 * @param module    - JSModule
 */


(function(){

    //class generator
    function $Class(className, module) {

        this._className = className;
        this._module = module;
        this._constructor = function(){
            //empty constructor
        };

        //defaults
        this._extendsTo         = null;
    }

    $Class.prototype = {
        //static array of methods to be executed inside constructor.
        _$preProcess:[],
        _$postProcess:[],

        $constructor:function(constMethod){
            this._constructor = constMethod;
            return this;
        },

        $prototype:function(pObj){
            var
                _class,
                _parentClass,
                self = this;

            //helper methods

            if(this._extendsTo){ //derived class

                _parentClass = function(){
                    //empty Constructor class;
                    //helps in newing without any fuzz...
                };
                _class = function(){
                    var inputs={
                        args:arguments,
                        superMethod:function(){},       //empty function
                        context:this,
                        generatorContext:self,
                        module:self._module,
                        className:self._className
                    };

                    //pre-process
                    for(var i=0;i<self._$preProcess.length;i++){
                        self._$preProcess[i].apply(self,[inputs]);
                    }

                    this.$super = inputs.superMethod;
                    self._extendsTo.apply(inputs.context,inputs.args);     //call parent's constructor //apply with this prevent polluting base method's prototype
                    self._constructor.apply(inputs.context,inputs.args);      //call own constructor
                };

                _parentClass.prototype = this._extendsTo.prototype;
                _class.prototype = new _parentClass();
                _class.prototype.constructor = _class; // for instanceof comparison

                for(var meth in pObj){
                    if(pObj.hasOwnProperty(meth)){
                        if(typeof  pObj[meth] === "function" )
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

            }
            else{  //base class
                _class = function(){

                    var inputs={
                        args:arguments,
                        superMethod:function(){},       //empty function
                        context:this,
                        generatorContext:self,
                        module:self._module,
                        className:self._className
                    };

                    //pre-process
                    for(var i=0;i<self._$preProcess.length;i++){
                        self._$preProcess[i].apply(self,[inputs]);
                    }

                    this.$super = inputs.superMethod;
                    self._constructor.apply(inputs.context,inputs.args); //call own constructor
                };
                _class.prototype  = pObj; //copy vars and methods via ref.
            }

            //post-process
            var inputs={
                generatedClass:_class,
                generatorContext:self,
                module:self._module,
                className:self._className
            };

            for(var i=0;i<self._$postProcess.length;i++){
                self._$postProcess[i].apply(self,[inputs]);
            }

            this._module[this._className] = inputs.generatedClass;
            return this._module[this._className];
        },

        $extends: function(classDefinition){
            this._extendsTo = classDefinition;
            return this;
        }

    };


    module.$Plugin("$Class")// name of plugin.
        .$provides(["JSModule"]) // injecting JSModule
        .$create(function(module){
            module.$Class =function(className){
                this._$pjs_._$classData[className] = new $Class(className,this);
                this[className] = function(){};
                return this._$pjs_._$classData[className];
            };

            //default meth will be post processed
            module.$Class.$$process = function(isPreProcess,meth){
                //add processor method only once.
                var cProto = $Class.prototype;

                var arr     = cProto._$postProcess,
                    present = false;

                if(isPreProcess){
                    arr = cProto._$preProcess;
                }
                for(var i=0;i<arr.length;i++){
                    if(arr[i] == meth){
                        present = true;
                        break;
                    }
                }
                if(!present){
                    arr.push(meth);
                }
            };

            return $Class;
        });


})();



(function () {

    function $Injectable(name, isClass, injectable) {
        this._injectable = injectable;
        this._isClass = isClass;
        this._name = name;
    }

    module.$Plugin("$Injectable") //name of plugin
        .$provides(["JSModule","$Class"]) // Injecting JSModule and $Class plugins (Dependencies)
        .$create(function(module,$Class){

            //adding Injectable functionality to module.
            module.$Injectable = function (name, isClass, injectable) {
                this._$pjs_._$injectables[name] = new $Injectable(name, isClass, injectable);
            };

            $Class.$provides = function (injectableStrArr) {
                this._provides = injectableStrArr;
                return this;
            };

            var undefinedInjectable = new $Injectable("Undefined",false,void 0);
            //dependency resolvers
            var getInjectableItem = function(itemName,module){
                var injectableItem = module._$pjs_._$injectables[itemName];
                while(!(injectableItem instanceof $Injectable) && module._$pjs_._$parentModule){
                    module  =   module._$pjs_._$parentModule;
                    injectableItem = module._$pjs_._$injectables[itemName];
                }

                return (injectableItem || undefinedInjectable);
            };

            var resolveInjectableItems = function(generatorContext,module){

                var injectableStrArr = generatorContext._provides;
                var injectableParams = [];

                for(var i=0;i<injectableStrArr.length;i++){
                    var injectableItem = getInjectableItem([injectableStrArr[i]],module);

                    if(injectableItem._isClass){
                        if(injectableItem._injectable == undefined){
                            console.error("Unable to Inject: "+injectableItem._name+" in "+generatorContext._className);
                            throw  new Error("Unable to Inject: "+injectableItem._name+" in "+generatorContext._className);
                        }
                        injectableItem._injectable = new injectableItem._injectable();
                        injectableItem._isClass = false;
                    }
                    injectableParams.push(injectableItem._injectable);
                }
                return injectableParams;
            };


            //Adding a $Class preprocessor to inject correct items.
            module.$Class.$$process(true,function(inputs){
                //inject args here..
                if(inputs.generatorContext._provides){
                    var argsToInject = resolveInjectableItems(inputs.generatorContext,inputs.module);
                    //backup original args
                    inputs["originalArgs"] = inputs.args;
                    inputs.args = argsToInject;
                }
            });



            //adding extendable functionality to module's $Injectable
            return module.$Injectable;
        });


})();



(function(){

    function $Serializer(item,toType,module){
        this.toTypes = {
            JSON:"JSON"
        };
        this.item = item;
        this.toType = "JSON"; // for now only to JSON.
        this._module = module;
    }

    $Serializer.prototype ={
        $serialize:function(){
            switch(this.toType){
                case this.toTypes.JSON:
                    this.item = JSON.stringify(this.item);
                    break;
            }
            return this.item;
        },
        $deserialize:function(){
            var self =this;
            var setPrototype = function(obj,classRef){

                //delete pjs className property
                delete obj["@pjsCN"];

                var dummy = function(){
                    //copy all values
                    for(var i in obj){
                        if(obj.hasOwnProperty(i)){
                            this[i] = obj[i];
                        }
                    }
                };

                dummy.prototype = classRef.prototype;
                return new dummy();
            };

            var revive= function(obj){
                for(var i in obj){
                    if(typeof obj[i] == "object"){
                        obj[i] = revive(obj[i]);
                    }
                }
                if(obj["@pjsCN"]){
                    if(obj["@pjsCN"].indexOf("..") == 0){
                        //root/ non anonymous module
                        var className = obj["@pjsCN"].slice(2);
                        var classRef = module(className);
                        obj = setPrototype(obj,classRef);
                    }
                    else{
                        //anonymous module
                        var classRef = module(obj["@pjsCN"],self._module);
                        obj = setPrototype(obj,classRef);
                    }
                }

                return obj;
            };

            switch(this.toType){
                case this.toTypes.JSON:
                    var item = JSON.parse(this.item);
                    this.item = revive(item);
                    break;
            }
            return this.item;
        }
    };

    module.$Plugin("$Serialize")
        .$provides(["JSModule","$Class"])
        .$create(function(module,$Class){

            module.$Serializer = function(item,type){
                return new $Serializer(item,type,this);
            };

            $Class.$serializable = function(){
                this.isSerializable = true;
                return this;
            };

            module.$Class.$$process(true,function(inputs){
                if(this.isSerializable){
                    var modulePath = inputs.module.getCompleteModulePath();
                    if(modulePath){
                        inputs.context["@pjsCN"]  = modulePath+"."+inputs.className;
                    }
                    else{
                        inputs.context["@pjsCN"]  = inputs.className;
                    }

                }
            });


            return $Serializer;
        });

})();})(window)
;