exports.multicontains = function(str, arr){
    var contains = false;
    arr.forEach(function(el, ind, a){
        if(!contains){
            if(str.indexOf(el) != -1)
                contains = true;
        }
    });
    return contains;
}