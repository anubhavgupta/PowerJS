/*
 TODO:
 1) add class definition        [Done]
 2) add class newing            [Done]
 3) add basic inheritance       [Done]
 4) add Injectable and provider [Done]
 4) add interfaces

 */
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
                            _class.prototype[meth] = function(methd){
                                return function(){
                                    var tempSuper = this.$super;
                                    this.$super = self._extendsTo.prototype[methd] || function(){};
                                    var returnVal = pObj[methd].apply(this,arguments);
                                    this.$super = tempSuper;
                                    return returnVal;
                                }
                            }(meth); //auto execute to give it a new scope

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


