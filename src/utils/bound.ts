export function Bound(target:any,key:string,desc:any){
    let original = desc.value;
    return {
        enumerable:true,
        get:function(){
            return Object.defineProperty(this,key,{
                value:original.bind(this)
            })[key];
        }
    }
}