import {Field,Id} from 'ecmamodel.ts';
import {Model} from "./base/model";
import {SCHEMA}  from 'ecmamodel.ts/lib/field';
import {Cached} from "../../utils/cached";
export class Customer extends Model {

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
    public code:string;

    @Field({
        type:String,
        trim:true,
        required:true
    })
    public name:string;

    @Field({
        type:String
    })
    public note:string;

    @Field({
        type:Number
    })
    public price:number;

    @Field({
        type:String,
        enum:['Mafia','Other','Event','Club','Patet'],
        default:'Other'
    })
    public category:number;

    @Field({
        type:Boolean,
        default:false
    })
    public finished:boolean;

    @Field({
        type:Date,
        default:Date.now()
    })
    public created_at:Date;

    @Field({
        type:Date,
        default:Date.now()
    })
    public updated_at:Date;

    @Field({
        type:Date,
        default:Date.now()
    })
    public finished_at:Date;

    @Cached
    public static get props():Array<string>{
        return Customer[SCHEMA].props;
    }
    public save(options?){
        this.set('updated_at',Date.now());
        return super.save(options);
    }
}