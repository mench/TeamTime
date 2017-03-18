import {inject,singleton} from 'dependency-injection.ts';
import {DatabaseService} from "./database";

export class CustomerService extends DatabaseService {
    protected tableName:string = 'customers';
}