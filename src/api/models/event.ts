import {Model} from "./base/model";
import {Field,Id} from 'ecmamodel.ts';
import {DbAdapter} from "../database/sync";
import {Cached} from "../../utils/cached";

export class Event extends Model{

    @Id
    @Field({
        type:Number
    })
    public id:string;

    @Field({
        type:String,
        trim:true,
        required:true
    })
    public name:string;

    @Field({
        type:Date,
        required:true
    })
    public start_time:Date;

    @Field({
        type:Date,
        required:true
    })
    public end_time:Date;

    @Field({
        type:Number,
        required:true
    })
    public price:number;

    @Cached
    protected get sync():DbAdapter{
        return new DbAdapter(this,'events');
    }

    public getStartTime(){
        return this.start_time.toLocaleDateString([],{month:'2-digit',day:'2-digit'}) + ' '+ this.start_time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    public getEndTime(){
        return this.end_time.toLocaleDateString([],{month:'2-digit',day:'2-digit'}) + ' '+ this.end_time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
}