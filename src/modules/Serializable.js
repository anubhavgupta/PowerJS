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

            module.$Serializer = function(item){
                return new $Serializer(item,this);
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




})();


/*
* {
*    value:"anubhav",
     _$pjs_className: ""
* }
*
* Serializable with date and regex Math
* Async programming.
* */

