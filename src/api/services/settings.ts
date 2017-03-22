import * as fs from 'fs';
import * as path from 'path';
import {Emitter} from 'ecmamodel.ts/lib/utils/emitter';

import {singleton} from 'dependency-injection.ts';
import {Objects} from "../../utils/objects";

const data = require('../../../data/settings.json');

@singleton
export class SettingsService extends Emitter {
    public data:any = data;
    public write():Promise<boolean>{
        this.emit('change',this,data);
        return new Promise((resolve,reject)=>{
            fs.writeFile(path.join(__dirname,'../../../data/settings.json'), JSON.stringify(this.data), 'utf8', function (err) {
                if( err ){
                    this.emit('error',this,err);
                    return reject(err);
                }
                this.emit('rewrite',this,data);
                resolve(true)
            });
        });
    }
    public set(data){
        this.data = Objects.merge(this.data,data);
        return this;
    }
}