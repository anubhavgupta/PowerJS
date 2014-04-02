# PowerJS


PowerJs ia a tiny library that makes coding fun, easy to write, modular and easy to read.


-----



Quick tutorial
====
---
Creating modules
----
Modules can be created by using `module` method. `Module` method takes 2 parameters.
 - Module Name / path("." delimited)
 - Module object [optional] - To create sub modules in the given module object 

````js
var myModule = module("com.example");
````
----

Creating Classes
--------------
Basic Class syntax.A Class can be created using `$Class` method and passing a class name to it. `$constructor` method can be used to define a constructor of the given class and `$prototype`[mandatory] method could be used to add methods/ members to it (these are shared among the the class object).

```js
myModule.$Class("ClassName")
    .$Constructor(function(){
      // code
    })
    .$prototype({
     // static code
      someMethod:function(){
        alert("Hello");
      }
    })
```

`$Class` parameters
 - Class Name - {String}
 
 

`$constructor` parameters
 - function - initialization function - this fnction gets called when a new object is created of this class.
 -
 
  
`$prototype` parameters
 - Object   -  Containing methods and member variables.

Inheritance
----
A Class can inherit another Class by passing it in `$extend` method.
```js
myModule.$Class("AnotherClassName")
    .$extends(myModule.ClassName)
    .$Constructor(function(){
      // code
    })
    .$prototype({
     // static code
    })
```

Calling super class methods
----
`this.$super()` method can be used  to call parent call method.
```js
myModule.$Class("AnotherClassName")
    .$extends(myModule.ClassName)
    .$Constructor(function(){
      // code
    })
    .$prototype({
     // static code
     someMethod:function(){
        this.$super();  //alerts "Hello"
        alert("World"); // alerts "World"
      }
    })
```

Creating objects
----
```js
var anotherClassObject = myModule.AnotherClassName();
anotherClassObject.someMethod(); //alerts "Hello" and then alerts "World".

```


License
====
MIT

Contact me:
[Anubhav]


[Anubhav]:anubhav200@gmail.com
**Free Software, Hell Yeah!**
    
