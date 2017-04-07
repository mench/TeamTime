import {Collection} from "./base/collection";
import {Event} from "./event";
import {sql} from "../database/sql";
import {Bound} from "../../utils/bound";
import {System} from "../../system";
import {Logger, Log} from "../../helpers/logger";
import {Promises} from "../../utils/promises";

export class EventCollection extends Collection {
    public tableName: string = "events";
    constructor(){
        super(Event);
        this.on('create',this.onAdd);
    }
    @Bound
    private onAdd(item:Event){
        item.once('destroy',this.onItemRemove);
    }
    @Logger
    public log:Log;
    @Bound
    private onItemRemove(model:Event){
        Promises.chain([
            ()=>{
                return this.db.run(
                    `DELETE FROM customers where id in (SELECT customer_id FROM relations WHERE event_id=${model.getId()} AND finished="false")`
                )
            },
            ()=>{
                return this.db.run(sql
                    .delete()
                    .from('relations')
                    .where('event_id = ?',model.getId())
                    .toString()
                )
            }
        ]).then(r=>{
            this.log.info('DELETED',model.toJSON());
        }).catch(this.log.error);
    }
}