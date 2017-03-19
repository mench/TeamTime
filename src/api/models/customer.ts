import {Field,Id} from 'ecmamodel.ts';
import {Model} from "./base/model";
import {SCHEMA}  from 'ecmamodel.ts/lib/field';
import {Cached} from "../../utils/cached";
import {Other} from "../helpers/calculations/other";
import {Mafia} from "../helpers/calculations/mafia";
import {Club} from "../helpers/calculations/club";
import {Event} from "../helpers/calculations/event";
import {Package} from "../helpers/calculations/package";
import {CATEGORIES} from "../helpers/categories";

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
        enum:['Mafia','Other','Event','Club','Package'],
        default:'Other'
    })
    public category:string;

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
    @Cached
    public get calculator(){
        switch (CATEGORIES[this.category.toUpperCase()]){
            case CATEGORIES.MAFIA :
                return new Mafia();
            case CATEGORIES.EVENT :
                return new Event();
            case CATEGORIES.CLUB :
                return new Club();
            case CATEGORIES.PACKAGE :
                return new Package();
            default :
                return new Other();
        }
    }
    public toObject(){
        let model = this.toJSON();
        if( model.created_at && !this.finished){
            model.created_at = new Date(model.created_at)
                .toString()
                .replace(/GMT(.*)/g,"");
            model.price = this.calculator.price(this.created_at);
        }
        return model;
    }
}