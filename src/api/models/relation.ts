import {Model} from "./base/model";
import {Field} from 'ecmamodel.ts';
import {DbAdapter} from "../database/sync";
import {Cached} from "../../utils/cached";

export class Relation extends Model{

    @Field({
        type:Number
    })
    public event_id:number;

    @Field({
        type:Number
    })
    public customer_id:number;

    @Cached
    protected get sync():DbAdapter{
        return new DbAdapter(this,'relations');
    }
}