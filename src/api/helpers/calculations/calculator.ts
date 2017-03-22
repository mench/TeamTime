import {System} from "../../../system";

export abstract class Calculator {
    protected settings:any;
    constructor(){
        this.settings = System.app.settings;
    }
}