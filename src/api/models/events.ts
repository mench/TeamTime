import {Collection} from "./base/collection";
import {Event} from "./event";
import {sql} from "../database/sql";

export class EventCollection extends Collection {
    public tableName: string = "events";
    constructor(){
        super(Event);
    }
}