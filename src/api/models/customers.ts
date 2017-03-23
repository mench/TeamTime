import {Collection} from "./base/collection";
import {Customer} from "./customer";
import {sql} from "../database/sql";

export class CustomerCollection extends Collection {
    public tableName: string = "customers";
    constructor(){
        super(Customer);
    }
    public async fetchByCode(code){
        return await this.db.store.get(sql
            .select()
            .from(this.tableName)
            .where('code = ?',code)
            .where('finished = 0')
            .toString()
        )
    }
    public async search(value,{fromDate = null,toDate=null} = {},trigger = true){
        let addon = '';
        if( fromDate && toDate ){
            addon+= `AND ( created_at BETWEEN CAST(${fromDate.getTime()} AS DATE ) AND CAST(${toDate.getTime()} AS DATE)  )`;
        }else if( fromDate ) {
            addon+= `AND ( created_at >=${fromDate.getTime()} )`;
        }else if( toDate ){
            addon+= `AND ( created_at <= ${toDate.getTime()} )`;
        }
        if ( value && value!='' ){
            addon += `AND (
                name LIKE '%${value}%'
                OR 
                code LIKE '%${value}%' 
                OR 
                note LIKE '%${value}%' 
                OR
                category LIKE '%${value}%'
                OR
                price LIKE '%${Number(value)}%'
            )`;
        }
        let res = await this.db.store.all(
            `SELECT 
            * FROM 
            customers 
            WHERE
            finished = 1
            ${addon}`
        );
        if(Array.isArray(res)){
            if( trigger ){
                return this.reset(res);
            }
            return res;
        }
        return false;
    }

    public async export(value,{fromDate = null,toDate=null} = {}){
        let res = await this.search(value,{fromDate:fromDate,toDate:toDate},false);
        if( res instanceof Array){
            return res.map(e=>{
                return {
                    CODE:e.code,
                    NAME:e.name,
                    CREATED_AT:e.created_at,
                    FINISHED_AT:e.finished_at,
                    NOTE:e.note,
                    PRICE:e.price,
                    CATEGORY:e.category
                };
            })
        }
        return [];
    }
}