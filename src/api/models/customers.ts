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
    public async search(value,{fromDate = null,toDate=null,category = null} = {},trigger = true){
        let addon = '';
        if( fromDate && toDate ){
            fromDate.setHours(0,0,0,0);
            toDate.setHours(0,0,0,0);
            addon+= `AND ( created_at >=${fromDate.getTime()} AND created_at <= ${toDate.getTime()}  )`;
        }else if( fromDate ) {
            fromDate.setHours(0,0,0,0);
            addon+= `AND ( created_at >=${fromDate.getTime()} )`;
        }else if( toDate ){
            toDate.setHours(0,0,0,0);
            addon+= `AND ( created_at <=${toDate.getTime()} )`;
        }

        if( category && category!=null && category!= ''){
            addon+= `AND ( category ='${category}' )`;
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
                    CREATED_AT:new Date(e.created_at)
                        .toString()
                        .replace(/GMT(.*)/g,""),
                    FINISHED_AT:new Date(e.finished_at)
                        .toString()
                        .replace(/GMT(.*)/g,""),
                    NOTE:e.note,
                    PRICE:e.price,
                    CATEGORY:e.category
                };
            })
        }
        return [];
    }
}