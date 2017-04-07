import {Service} from "./service";
import {singleton} from 'dependency-injection.ts';
import {Cached} from "../../utils/cached";

@singleton
export class DatabaseService extends Service {

    @Cached
    private get connection(){
        let connection = window.openDatabase("TeamTime", "0.1", "A Database of Customer", 2048 * 2048);
        connection.transaction(function (t) {
            t.executeSql(`
                CREATE TABLE customers
                (
                    id INTEGER PRIMARY KEY,
                    code TEXT,
                    name TEXT,
                    note TEXT,
                    price REAL,
                    category TEXT,
                    created_at INTEGER,
                    updated_at INTEGER,
                    finished_at INTEGER, 
                    finished TINYINT(1) NULL)
              `);
        });
        connection.transaction(function (t) {
            t.executeSql(`
                CREATE TABLE events
                (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    start_time DATETIME,
                    end_time DATETIME,
                    price DOUBLE,
                    created_at DATETIME,
                    updated_at DATETIME
                );
              `,[]);
        });
        connection.transaction(function (t) {
            t.executeSql(`
                CREATE TABLE "relations"
                (
                    event_id INTEGER,
                    customer_id INTEGER,
                    created_at TEXT,
                    updated_at TEXT,
                    id INTEGER PRIMARY KEY AUTOINCREMENT
                );
              `);
        });
        return connection;
    }
    public run(sql,opt?){
        return new Promise((resolve,reject)=>{
            this.connection.transaction(function (t) {
                t.executeSql(sql, opt  || [], function (transaction, res) {
                    //res.insertId
                    resolve(res);
                });
            })
        })
    }
    public get(sql,opt?){
        return new Promise((resolve,reject)=>{
            this.connection.transaction(function (t) {
                t.executeSql(sql, opt  || [], function (transaction, results) {
                    let list = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        list.push(results.rows.item(i));
                    }
                    if( list.length > 1 ){
                        return resolve(list);
                    }
                    return resolve(list[0]);
                });
            })
        })
    }
    public all(sql,opt?){
        return new Promise((resolve,reject)=>{
            this.connection.transaction(function (t) {
                t.executeSql(sql, opt  || [], function (transaction, results) {
                    let list = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        list.push(results.rows.item(i));
                    }
                    return resolve(list);
                });
            })
        })
    }
}