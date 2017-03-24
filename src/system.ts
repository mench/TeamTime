import {
    inject,
    singleton,
    container
} from 'dependency-injection.ts';
import {Config} from "./config/index";
import {Cached} from "./utils/cached";
import {Logger, Log} from "./helpers/logger";

import {View} from "./components/view";
import LocalConfig from './config/local';
import ProdConfig from './config/prod';
import {DatabaseService} from "./api/services/database";
import {Promises} from "./utils/promises";
import {SettingsService} from "./api/services/settings";

@singleton
export class System {

    @Cached
    public static get app():System{
        let {ENV} = this;
        switch (this.env){
            case ENV.LOCAL:
                container.bind(Config,LocalConfig);
                break;
            case ENV.PRODUCTION:
                container.bind(Config,ProdConfig);
                break;
        }
        return container
            .getInstanceOf(System);
    }
    @Cached
    public static get env():string{
        return process.env.NODE_ENV || 'local';
    };
    public static ENV = {
        LOCAL       : "local",
        PRODUCTION  : "production"
    };
    @Logger
    public log:Log;
    @inject
    public config:Config;
    @inject
    public view:View;
    @inject
    public database:DatabaseService;
    @inject
    public settings:SettingsService;

    public start(){
        this.log.info("System Starting");
        Promises.chain([
            ()=>{
                return  this.database.start();
            },
            ()=>{
                return  this.database.migrate();
            }
        ]).then(()=>{
            this.log.info("System Started");
            this.view.render();
        }).catch(e=>{
            this.log.error("System Rejected",e);
        });
    }
}
System.app.start();