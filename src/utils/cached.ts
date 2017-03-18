export function Cached(target:any,key:string,desc:any){
    let initializer = desc.get;
    desc.get = function(){
        return Object.defineProperty(this,key,{
            value:initializer.call(this)
        })[key];
    };
    return desc;
}