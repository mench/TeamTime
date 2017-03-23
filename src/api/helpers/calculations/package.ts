import {Other} from "./other";

export class Package extends Other{
    protected totalPrice:number = this.settings.data.package.totalPrice;
    protected finish_hour:number = this.settings.data.package.finish_hour;

    public price(created_at:Date):number{
        let end_time = created_at.getTime() + this.finish_hour*3600000;
        if( Date.now() <= end_time ){
            return this.totalPrice;
        }
        return this.totalPrice + super.price(new Date(end_time),true);
    }

}