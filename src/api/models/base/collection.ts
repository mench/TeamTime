import {Collection as EcmaCollection} from 'ecmamodel.ts';
import {DbAdapter} from "../../database/sync";
import {Cached} from "../../../utils/cached";
import {System} from "../../../system";
import {DatabaseService} from "../../services/database";
import {Model} from "./model";

export interface SqlTrait {
    total():Promise<any>;
    tableName:string;
}

export class Collection extends EcmaCollection implements SqlTrait{
    public tableName: string = "customers";

    constructor(type: Model | any){
        super(type);
    }
    @Cached
    protected get db():DatabaseService{
        return System.app.database;
    }
    public get sync():DbAdapter{
        return new DbAdapter(this);
    }
    public async total():Promise<any>{
        return this.db
            .count();
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