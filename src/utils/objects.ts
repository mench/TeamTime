export class Objects {
    static toString(object):string{
        return JSON.stringify(object,null,2)
    }
    static toObject(string):any{
        return JSON.parse(string);
    }
    static merge(source,...patches):any{
        return this.patch({},source,...patches)
    }
    static patch<T>(source:T,...patches:any[]):T{
        for(var patch of patches){
            if(typeof patch == 'object'){
                for (var k in patch) {
                    source[k] = patch[k];
                }
            }
        }
        return source;
    }
}