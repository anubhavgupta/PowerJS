# PowerJS


PowerJS is a powerful utility that not just helps in writing a modular, Object oriented JavaScript but also provides features like Dependency Injection.

-----


Quick tutorial
====

---
Creating modules
---

Modules are the basic unit in PowerJS that can be used further to create classes, add injectable items, etc. Modules can be created by using `module` method.


`module` method takes 2 parameters.
 - String - Module Name [optional] / path("." delimited)
 - module - Module object [optional] - To create sub modules in the given module object 

```js
//eg 1 creates an example module inside a "com" module and returns "example" module
var myModule = module("com.example");

//eg.2 .. similarly creates and returns "inner" module.
var innerModule = module("com.example.inner");
```


One can also create an **anonymous module**, simply my not providing any parameters.

```js
//anonymous module.
var anonymousModule = module();

```



Creating Sub-Modules inside a module. 
There are two ways of creating a sub module inside a module.
```js
//first way
/**
*this will create a new module with the name "newSubModule" inside someModule
*/
var someModule = module("com.example");
var newSubModule = module("com.example.newSubModule");

//second way
/**
*this will create a new module with the name "newSubModule" inside anonymousModule
*/
var anonymousModule = module();//anonymous module.
var newSubModule = module("newSubModule",anonymousModule);

```
----



Creating Classes
--------------

Here is how we can add classes to a module. A class can be created using `$Class` method and passing a class name to it. `$constructor`[optional] method can be used to define a constructor of the given class and `$prototype`[mandatory] method could be used to add methods/ members to it (these are shared among the the class object).

```js
var App = module("app");

App.$Class("AwesomeApp")
    .$constructor(function(name){
      // constructor code here
      this.sayHello(name);
    })
    .$prototype({
      // static shared code here
      sayHello:function(name){
        alert("Hello "+name+"!!!");
      },
      sayHelloWorld:function(){
        alert("Hello World");
      }
      
    });

    
var appObj = new App.AwesomeApp("Batman");  //alerts Hello Batman!!!

appObj.sayHelloWorld();                     //alerts Hello World

```

`$Class` parameters
 - String - Name of Class
 

`$constructor` parameters
 - function - initialization function - this fnction gets called every time when a new object is created of this class.
 -
 
  
`$prototype` parameters
 - Object   -  Containing shared methods and shared member variables.
            
        
```js

// Constructor is optional.

var App = module("app");

//this also works
App.$Class("AwesomeApp")
    .$prototype({
      // static shared code here
      sayHello:function(name){
        alert("Hello "+name+"!!!");
      }
    });

    
var appObj = new App.AwesomeApp();  //alerts Hello Batman!!!
appObj.sayHello("Batman");          //alerts Hello World

```
----            

Inheritance
----

A Class can inherit another Class by passing it in `$extend` method.
```js
var App = module("app");

App.$Class("BaseClass")
    .$constructor(function(){
        // code
    })
    .$prototype({
        sayHello:function(name){
            alert("Hello "+name+"!!!");
        }
    });
    
App.$Class("DerivedClass")
    .$extends(App.BaseClass)
    .$constructor(function(){
        // code
    })
    .$prototype({
        sayHelloDerived:function(name){
            this.sayHello(name);
            alert("How Are You ?");
        }
    });
    
var baseClassObj = new App.BaseClass();
baseClassObj.sayHello("Batman");    
//o/p
//alerts Hello Batman!!!

var derivedClassObj = new App.DerivedClass();
derivedClassObj.sayHelloDerived("Batman");
//o/p
// alerts Hello Batman!!!
// alerts How Are You ?
```

Calling super class methods
----
`this.$super()` method can be used in a derived class to call base class method.
```js
var App = module("app");

App.$Class("BaseClass")
    .$constructor(function(){
        // code
    })
    .$prototype({
        sayHello:function(name){
            alert("Hello "+name+"!!!");
        }
    });
    
App.$Class("DerivedClass")
    .$extends(App.BaseClass)
    .$constructor(function(){
        // code
    })
    .$prototype({
        sayHello:function(name){
            this.$super(name);
            alert("How Are You ?");
        }
    });



var derivedClassObj = new App.DerivedClass();
derivedClassObj.sayHello("Batman");
//o/p
// alerts Hello Batman!!!
// alerts How Are You ?
```
----

Advance Features
====


----
Dependency Injection
----
Anything like an object/ function/ string, etc. can be injected to the constructor of a class. `$Injectable` method can be used to declare dependencies and `$provides` method can be used to inject dependencies.

**Defining Dependencies:**
```js
var App = module("app");

//Declaring an Injectable Object
App.$Injectable("MessageObject",false,{ value:"Hello World!!!" } );

//Declaring an Injectable String
App.$Injectable("Message",false,"Hello World!!!");

//Declaring an Injectable Class
App.$Class("Alerter")
    .$prototype({
        alertValue:function(value){
            alert(value);
        }
    });

App.$Injectable("Alerter",true,App.Alerter);

```
`$Injectable` takes 3 parameter
-  String : Name of Injectable item which will be used later in `$provides` to fetch the correct item.
-  Boolean : True if the item to be injected is a class and needs to be new-ed once before injecting.
-  Anything: Item to be injected.
  

  
**Injecting dependencies:**

```js
//injection example
//usage of $provides

var App = module("app");


App.$Class("InjectionExample")
    .$provides(["Message"])  // injecting "Hello World!!!" string
    .$constructor(function(message){
        //message is injected into the constructor
        alert(message) // alerts hello World!!!    
    })
    .$prototype({});
    
//Declaring an Injectable String
App.$Injectable("Message",false,"Hello World!!!");
var InjectionEgObj = new App.InjectionExample();


```



**Example of injecting a class:**
```js
var App = module("app");

//Defining an "Alerter" class.
App.$Class("Alerter")
    .$constructor(function(){
        this.name = "JavaScripters!!";
    })
    .$prototype({
        alertValue:function(value){
            alert(value);
        }
    });
   
//class in which "Alerter" class is to be injected along with a message.
App.$Class("InjectionExample")
    .$provides(["Alerter","Message"])
    .$constructor(function(alerter,message){
        // alerts Hello World!!! JavaScripters!!
        alerter.alertValue(message+" "+alerter.name); 
    })
    .$prototype({});

//Declaring an Injectable String
App.$Injectable("Message",false,"Hello World!!!");
//Declaring an Injectable Class
App.$Injectable("Alerter",true,App.Alerter);
var InjectionEgObj = new App.InjectionExample();

```
`$provides` takes 1 parameter:

- Array - Array of strings, name of items to be injected.


**Scoping of an Injectable item.**

When an injectable item is declared on a module, it will be available for all the classes in that module and its sub module.

The string array passed in `$provides` method in a `$Class` is resolved only when the class is new-ed.

```js
//scoping
var Example = module("com.example");
var Pages   = module("com.example.pages");
var Page1   = module("com.example.pages.page1");

//"MessageObj" declared on "Pages" module
Pages.$Injectable("MessageObj",false,{
    message:"Hello JavaScripters!!"
});

Pages.$Class("Common")
    .$provides(["MessageObj"])  //"MessageObj" available in "Pages" module
    .$constructor(function(messageOb){
        alert(messageOb.message); // alerts Hello JavaScripters!!
    })
    .$prototype({});
    
Page1.$Class("Page1Class")
    .$provides(["MessageObj"])//"MessageObj" also accessable in "Page1" module.
    .$constructor(function(messageOb){
        alert(messageOb.message); // alerts Hello JavaScripters!!
    })
    .$prototype({});

Example.$Class("ExampleClass")
    .$provides(["MessageObj"])//"MessageObj" not accessable in "Page1" module.
    .$constructor(function(messageOb){
        alert(messageOb.message); // Error!!!
    })
    .$prototype({});
```


License
====
**MIT**

Contact me:
[Anubhav]


[Anubhav]:anubhav200@gmail.com
**Free Software, Hell Yeah!**
    

