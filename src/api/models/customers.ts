import {Collection} from "./base/collection";
import {Customer} from "./customer";
import {sql} from "../database/sql";

export class Customers extends Collection {
    constructor(){
        super(Customer);
    }
    public async fetchByCode(code){
        return await this.db.store.get(sql
            .select()
            .from(this.tableName)
            .where('code = ?',code)
            .where('finished = ?',0)
            .toString()
        )
    }
}