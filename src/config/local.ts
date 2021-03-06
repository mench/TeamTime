import {Config} from "./index";
import {singleton} from 'dependency-injection.ts';
import {LEVEL} from "../helpers/logger";


@singleton
export default class LocalConfig extends Config {
    public logger =  {
        level: LEVEL.DEBUG,
        json: false,
        stringify: false
    };

}