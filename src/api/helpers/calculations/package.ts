import {Other} from "./other";

export class Package extends Other{
    protected totalPrice:number = 1500;
    protected finish_hour:number = 4;

    public price(created_at:Date):number{
        let end_time = created_at.getTime() + this.finish_hour*3600000;
        if( created_at.getTime() <= end_time ){
            return this.totalPrice;
        }
        return this.totalPrice + super.price(new Date(end_time));
    }

}