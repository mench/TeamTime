/// <reference types="winston" />
/// <reference types="react" />
declare module "config/index" {
    export abstract class Config {
        abstract logger: {
            level: string;
            json: boolean;
            stringify: boolean;
        };
    }
}
declare module "utils/cached" {
    export function Cached(target: any, key: string, desc: any): any;
}
declare module "helpers/logger" {
    import { Winston } from 'winston';
    export interface Log extends Winston {
    }
    export const LEVEL: {
        ERROR: string;
        INFO: string;
        VERBOSE: string;
        DEBUG: string;
        WARN: string;
    };
    export function Logger(target: any, key: string): any;
}
declare module "components/hello" {
    import { Component } from 'react';
    export class Hello extends Component<any, any> {
        render(): JSX.Element;
    }
}
declare module "components/view" {
    export class View {
        render(): void;
    }
}
declare module "config/local" {
    import { Config } from "config/index";
    export default class LocalConfig extends Config {
        logger: {
            level: string;
            json: boolean;
            stringify: boolean;
        };
    }
}
declare module "system" {
    import { Config } from "config/index";
    import { Log } from "helpers/logger";
    import { View } from "components/view";
    import LocalConfig from "config/local";
    export class System {
        static readonly loadConfig: typeof LocalConfig;
        static readonly app: System;
        static readonly env: string;
        log: Log;
        config: Config;
        view: View;
        start(): void;
    }
}
