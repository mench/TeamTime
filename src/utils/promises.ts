export class Promises {
    static all(promises:Promise<any>[]):Promise<any>{
        return Promise.all(promises);
    }
    static chain(promises:(()=>Promise<any>)[]):Promise<any>{
        let promise = Promise.resolve(true);
        promises.forEach(p=>{
            promise = promise.then(p);
        });
        return promise;
    }
}