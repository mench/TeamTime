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
        let store = this.db;
        let entity = this.entity.toJSON();
        let res:any = await store.run(
            (`  INSERT INTO ${this.tableName} (${Object.keys(entity).join(',')}) 
                VALUES(${Object.keys(entity).map(v=>'?').join(',')})`
            ),Object.keys(entity).map(k=>entity[k]))
            .catch(e=>{
            System.app.log.error(e);
        });
        return await this.db.get(sql
            .select()
            .from(this.tableName)
            .where('id = ?',res.insertId)
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
    public async update():Promise<any>{
        let store = this.db;
        let entity = this.entity.toJSON();
        delete entity.created_at;
        entity.updated_at = Date.now();
        let id = entity.id;
        delete entity.id;
        return await store.run(
            (`UPDATE ${this.tableName} SET ${Object.keys(entity).map(k=>`${k} = ?`).join(',')} WHERE id=?`),
            Object.keys(entity).map(k=>entity[k]).concat([id])).catch(e=>{
            System.app.log.error(e);
        }).then(r=>{
            return this.entity.toJSON();
        });
    }
    public async delete():Promise<any>{
        let store = this.db;
        return await store.run(
            sql.delete()
                .from(this.tableName)
                .where('id = ?',this.entity.getId())
                .toString()
        ).then(r=>{
            return this.entity.toJSON()
        }).catch(e=>{
            System.app.log.error(e);
            return this.entity.toJSON()
        });
    }

}