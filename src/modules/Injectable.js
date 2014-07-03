/**
 * Injectable Class
 * Provides the facility of making an item injectable and injecting them to class's constructor.
 */

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


