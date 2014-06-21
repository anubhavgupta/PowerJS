
    var
        store ={
            modules:{},
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
