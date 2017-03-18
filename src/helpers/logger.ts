import {
    inject,
    singleton,
    container
} from 'dependency-injection.ts';
import * as winston from 'winston';
import {Winston} from 'winston';
import {Config} from "../config/index";

export interface Log extends Winston{}

export const LEVEL  = {
    ERROR    : 'verbose',
    INFO     : 'info',
    VERBOSE  : 'verbose',
    DEBUG    : 'debug',
    WARN     : 'warn'
};

@singleton
class LogHelper {
    @inject
    config:Config;
    private logger:Log;
    constructor(){
        let {logger} =  this.config;
        winston.remove(winston.transports.Console);
        winston.add(winston.transports.Console, {
            colorize: true,
            timestamp: function () {
                let date = new Date();
                return date.getDate() + '/' + (date.getMonth() + 1) + ' ' + date.toTimeString().substr(0,5) + ' [' + global.process.pid + ']';
            },
            level: logger.level,
            json: logger.json,
            stringify: logger.stringify
        });
        this.logger = winston;
    }
}
export function Logger(target:any,key:string):any{
    return {
        enumerable:true,
        configurable:true,
        get:function () {
            return Object.defineProperty(this,key,{
                enumerable:true,
                configurable:true,
                value:container.getInstanceOf(LogHelper).logger
            })[key];
        }
    }
}