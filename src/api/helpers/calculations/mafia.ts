import {Other} from "./other";
import {WEEKDAYS} from "../weekdays";

export class Mafia extends Other {
    protected start_time:Date;
    protected end_time:Date;
    protected totalPrice = 1000;

    constructor(){
        super();
        this.init();
    }
    protected init(){
        let today = new Date().getDay();
        switch (today){
            case WEEKDAYS.THURSDAY :
                //TODO must give from settings
                var start_date = new Date();
                start_date.setHours(19);
                start_date.setMinutes(0);
                var end_date = new Date();
                end_date.setHours(22);
                end_date.setMinutes(0);
                this.start_time = start_date;
                this.end_time = end_date;
                break;
            case WEEKDAYS.SUNDAY :
                //TODO must give from settings
                var start_date = new Date();
                start_date.setHours(19);
                start_date.setMinutes(0);
                var end_date = new Date();
                end_date.setHours(22);
                end_date.setMinutes(0);
                this.start_time = start_date;
                this.end_time = end_date;
                break;
        }
    }
    public price(created_at:Date):number{
        if( this.start_time && this.end_time ){
            if( created_at >= this.start_time && created_at <= this.end_time ){
                return this.totalPrice;
            }
            if( created_at > this.end_time ){
                return this.totalPrice + super.price(this.end_time);
            }
            return 0;
        }
        return super.price(created_at);
    }
}