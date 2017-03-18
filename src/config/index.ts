export abstract class Config {
    public database = {name: 'team_time.sqlite'};
    public abstract logger:{
        level:string;
        json: boolean,
        stringify: boolean
    }
}