/**
 * Creates a object store inside the passed object
 * for a given string array.
 *
 * @param scope
 * @param index
 * @param strArray
 * @returns {object} - final scope object
 */
function createNamespace(scope,index,strArray){
    if(index >= strArray.length){
        return scope;
    }
    if(!scope[strArray[index]]){
        scope[strArray[index]] ={};
    }
    return createNamespace(scope[strArray[index]],++index,strArray);
}

