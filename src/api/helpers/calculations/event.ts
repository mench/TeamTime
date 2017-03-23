import {Mafia} from "./mafia";
export class Event extends Mafia {
    protected init(){
        //defaults
        let start_date = new Date();
        start_date.setHours(19);
        start_date.setMinutes(0);
        let end_date = new Date();
        end_date.setHours(22);
        end_date.setMinutes(0);
        this.start_time = start_date;
        this.end_time = end_date;
    }
}