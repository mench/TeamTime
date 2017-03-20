import {Collection as EcmaCollection} from 'ecmamodel.ts';
import {DbAdapter} from "../../database/sync";
import {Cached} from "../../../utils/cached";
import {System} from "../../../system";
import {DatabaseService} from "../../services/database";
import {Model} from "./model";

export interface SqlTrait {
    tableName:string;
}

export class Collection extends EcmaCollection implements SqlTrait{
    public tableName: string;

    constructor(type: Model | any){
        super(type);
    }
    @Cached
    protected get db():DatabaseService{
        return System.app.database;
    }
    public get sync():DbAdapter{
        return new DbAdapter(this,this.tableName);
    }
    public select(sql):Promise<any>{
        return this.db.store.get(sql.from(this.tableName).toString());
    }
    public async fetch(sql):Promise<false | this>{
        let res = await this.db.store.all(
            sql
                .from(this.tableName)
                .toString()
        );
        if(Array.isArray(res)){
            return this.reset(res);
        }
        return false;
    }
}