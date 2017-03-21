import {Model as Ecmamodel,Field,Id} from 'ecmamodel.ts';
import {DbAdapter} from "../../database/sync";
import {Bound} from "../../../utils/bound";

export class Model extends Ecmamodel {
    constructor(data?){
        super(data);
        if( this.isNew ){
            this.created_at = new Date();
            this.updated_at = new Date();
        }
    }

    @Field({
        type:Date
    })
    public created_at:Date;

    @Field({
        type:Date
    })
    public updated_at:Date;
}