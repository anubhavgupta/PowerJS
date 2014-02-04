/**
 * PowerJS module Implementation
 */

/*
 store ={
 classes:{},
 injectables:{},
 namespace:{
     SIMS:{
         ACCESS:{
             __ps__:{
                     classData:{},
                     injectables:{}
                    }
             class1: function(){};
             class2: function(){};
         }
     }
 },
 * */

function jsModule(){
    this.____ps____ = {
        classData:{},
        injectables:{}
    };
};

jsModule.prototype = {

    $Class: function (name,injectableArr,meth) {
        if(typeof injectableArr === "function"){
            this.classes[name] = {
                meth:injectableArr
            }
        }
        else if(typeof injectableArr === "array" && typeof meth === "function"){
            this.classes[name] = {
                injectableArr:injectableArr,
                meth:meth
            }
        }
        else throw new Error("INVALID PARAMETER TYPES");

    }

};
