import {SyncHttp} from 'ecmamodel.ts/lib/sync/http';
import {Cached} from "../../utils/cached";
import {DatabaseService} from "../services/database";
import {System} from "../../system";
import {sql} from "./sql";
import {Model} from "../models/base/model";
import {Collection} from "../models/base/collection";

export class DbAdapter extends SyncHttp {
    constructor(entity:Model | Collection,protected tableName:string){
        super(entity);
    }
    @Cached
    protected get db():DatabaseService{
        return System.app.database;
    }
    public async create():Promise<any>{
        let {store} = this.db;
        let entity = this.entity.toJSON();
        let res = await store.run.apply(store,[
            (`INSERT INTO ${this.tableName} (${Object.keys(entity).join(',')}) VALUES(${Object.keys(entity).map(v=>'?').join(',')})`)
        ].concat(Object.keys(entity).map(k=>entity[k]))).catch(e=>{
            console.info(e)
        });
        return await this.db.get(sql
            .select()
            .from(this.tableName)
            .where('id = ?',res.stmt.lastID)
            .toString()
        );
    }
    public read():Promise<any>{
        return this.db
            .get(sql
                .select()
                .from(this.tableName)
                .where('id = ?',this.entity.get('id'))
                .toString()
            );
    }
    // public update():Promise<any>{
    //     return new Promise((resolve,reject)=>{
    //         this.db.update({_id:this.entity.get('id')},this.entity.toJSON(),(err,doc)=>{
    //             if( err ) return reject(err);
    //             resolve(doc);
    //         });
    //     });
    // }
    // public delete():Promise<any>{
    //     return new Promise((resolve,reject)=>{
    //         this.db.remove({_id:this.entity.get('id')},(err,doc)=>{
    //             if( err ) return reject(err);
    //             resolve(doc);
    //         });
    //     });
    // }
    //
    // public count():Promise<any>{
    //     return new Promise((resolve,reject)=>{
    //         this.db.count({},(err,count)=>{
    //             if( err ) return reject(err);
    //             resolve(count);
    //         });
    //     });
    // }
}