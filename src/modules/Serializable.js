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
            var item = JSON.parse(this.item);
            var reviver = function(obj){
                var cls = module()
            }
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
                    inputs.context["@pjsCN"]  = inputs.module.getCompleteModulePath()+"."+inputs.className;
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

