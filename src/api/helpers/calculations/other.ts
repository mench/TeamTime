export class Other {
    protected minimum:number = 300;
    protected oneHour:number = 600;
    public static toMinutes(millis:number){
        return Math.floor(millis / 60000);
    }

    public price(created_at:Date):number{
        let price = this.oneHour/60;
        let currentPrice = Math.round(Other.toMinutes( Date.now() - created_at.getTime())*price);
        return currentPrice > this.minimum ? currentPrice : this.minimum;
    }
}