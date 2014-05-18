
    var
        store ={
            modules:{}
        },
        undefined = void 0,
        ERROR_STRINGS = {
            TYPE_STRING:"Expected String Type.",
            INSTANCE_JSMODULE:"Expected instanceof JSModule."
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
