import {Service} from "./service";
import * as path from 'path';
import {inject,singleton} from 'dependency-injection.ts';
import {Database} from "../libs/sqlite/Database";
import {Config} from "../../config/index";
import sqlite from '../libs/sqlite';

@singleton
export abstract class DatabaseService extends Service {
    protected abstract tableName:string;
    @inject
    private config:Config;
    public connect():Promise<Database>{
        return sqlite.open(this.filename, { Promise });
    }
    protected get filename(){
        return path.resolve(__dirname,`../../../data/${this.config.database.name}`)
    };
    public store:Database;
    public async start():Promise<DatabaseService>{
        this.log.info("Connecting Database");
        this.store =  await this.connect();
        return this;
    }
    public async findById(id){
        return await this.store.get(`SELECT * FROM ${this.tableName} WHERE id = ?`,id);
    }
    public table(tableName:string){
        this.tableName = tableName;
        return this;
    }
    public async count(){
        let result:{total:number} = await this.store.get(`SELECT COUNT(*) as total FROM ${this.tableName}`);
        return result.total;
    }
}