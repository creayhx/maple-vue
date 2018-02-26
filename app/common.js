exports.co = function (generator){
    var gen = generator();
    function next(value){
        var res = value ? gen.next(value) : gen.next();
        if(!res.done){
            if( typeof res.value === 'function'){
                res.value(function(err,result,fields){
                    if(err){
                        console.log('co-error : ',err)
                        next(null);
                    }else{
                        next(result);
                    };
                });
            }else{
                next(res.value);
            };
        };
    };
    next();
};
exports.thunkify = function (fn,obj){
    return function(){
        var argv = Array.prototype.slice.call(arguments);
        var ctx = obj || this;
        return function(done){
            argv.push(done);
            try{
                fn.apply(ctx,argv);
            }catch(err){
                throw new Error("Error");
            };
        };
    };
};