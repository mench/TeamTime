import {Service} from "./service";
import * as path from 'path';
import {inject,singleton} from 'dependency-injection.ts';
import {Database} from "../libs/sqlite/Database";
import {Config} from "../../config/index";
import sqlite from '../libs/sqlite';

@singleton
export class DatabaseService extends Service {
    @inject
    private config:Config;
    public connect():Promise<Database>{
        return sqlite.open(this.filename, { Promise });
    }
    public migrate():Promise<any>{
        return sqlite.migrate({
            migrationsPath:path.resolve(__dirname,`../../../data/migrations`)
        });
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
    public async get(sql:string){
        return await this.store.get(sql);
    }
}