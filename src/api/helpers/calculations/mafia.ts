import {Other} from "./other";
import {WEEKDAYS} from "../weekdays";

export class Mafia extends Other {
    public start_time:Date;
    public end_time:Date;
    public totalPrice:number;

    constructor(){
        super();
        this.init();
    }
    formatTime = d =>{
        let date = new Date();
        date.setHours(d.hours);
        date.setMinutes(d.minutes);
        return date;
    };
    get startTimeThursday(){
        return this.formatTime(this.settings.data.mafia.THURSDAY.start_time);
    }
    get startTimeSunday(){
        return this.formatTime(this.settings.data.mafia.SUNDAY.start_time);
    }
    get endTimeThursday(){
        return this.formatTime(this.settings.data.mafia.THURSDAY.end_time);
    }
    get endTimeSunday(){
        return this.formatTime(this.settings.data.mafia.SUNDAY.end_time);
    }
    protected init(){

    }
    protected createTimestamp(created_at:Date){
        let today = created_at.getDay();
        switch (today){
            case WEEKDAYS.MONDAY :
                this.start_time = this.startTimeThursday;
                this.end_time = this.endTimeThursday;
                this.totalPrice = this.settings.data.mafia.THURSDAY.totalPrice;
                break;
            case WEEKDAYS.SUNDAY :
                this.start_time = this.startTimeSunday;
                this.end_time = this.endTimeSunday;
                this.totalPrice = this.settings.data.mafia.SUNDAY.totalPrice;
                break;
        }
    }
    public price(created_at:Date):number{
        this.createTimestamp(created_at);
        if( this.start_time && this.end_time ){
            let now = new Date();
            if( created_at > this.end_time ){
                return super.price(created_at);
            }
            if( now >= this.start_time && now <= this.end_time ){
                return this.totalPrice;
            }
            if( now > this.end_time ){
                return this.totalPrice + super.price(this.end_time,true);
            }
            return 0;
        }
        return super.price(created_at);
    }
}