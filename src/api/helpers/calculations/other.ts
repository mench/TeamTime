import {Calculator} from "./calculator";

export class Other extends Calculator{
    protected minimum:number = this.settings.data.other.minimum;
    protected oneHour:number = this.settings.data.other.oneHour;
    public static toMinutes(millis:number){
        return Math.floor(millis / 60000);
    }

    public price(created_at:Date,ignore=false):number{
        let price = this.oneHour/60;
        let currentPrice = Math.round(Other.toMinutes( Date.now() - created_at.getTime())*price);
        return (currentPrice < this.minimum && !ignore) ? this.minimum : currentPrice;
    }
}