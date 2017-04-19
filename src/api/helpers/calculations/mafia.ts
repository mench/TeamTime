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
    formatTime = (created_at:Date,opt:any) =>{
        let date = new Date(created_at.getTime());
        date.setHours(opt.hours);
        date.setMinutes(opt.minutes);
        date.setSeconds(0);
        return date;
    };
    startTimeThursday(created_at:Date){
        return this.formatTime(created_at,this.settings.data.mafia.THURSDAY.start_time);
    }
    startTimeSunday(created_at:Date){
        return this.formatTime(created_at,this.settings.data.mafia.SUNDAY.start_time);
    }
    endTimeThursday(created_at:Date){
        return this.formatTime(created_at,this.settings.data.mafia.THURSDAY.end_time);
    }
    endTimeSunday(created_at:Date){
        return this.formatTime(created_at,this.settings.data.mafia.SUNDAY.end_time);
    }
    protected init(){

    }
    protected createTimestamp(created_at:Date){
        let today = created_at.getDay();
        switch (today){
            case WEEKDAYS.THURSDAY :
                this.start_time = this.startTimeThursday(created_at);
                this.end_time = this.endTimeThursday(created_at);
                this.totalPrice = this.settings.data.mafia.THURSDAY.totalPrice;
                break;
            case WEEKDAYS.SUNDAY :
                this.start_time = this.startTimeSunday(created_at);
                this.end_time = this.endTimeSunday(created_at);
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