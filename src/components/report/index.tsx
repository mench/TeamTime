import * as React from 'react';
import {Component} from 'react';
import {Card, CardHeader ,CardText} from 'material-ui/Card';
import {Other} from "../dashboard/other";
import {sql} from "../../api/database/sql";
import {Customer} from "../../api/models/customer";
import CircularProgress from 'material-ui/CircularProgress';
import {Bound} from "../../utils/bound";
import DatePicker from 'material-ui/DatePicker';
import ActionUpdateIcon from 'material-ui/svg-icons/action/update';
import ActionExportIcon from 'material-ui/svg-icons/action/get-app';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {green300} from 'material-ui/styles/colors';
import Snackbar from 'material-ui/Snackbar';

require('csvexport');
let glob:any = window;
let Export = glob.Export;
const exporter = Export.create({
    filename: "team_time-report.csv",
});
const {DataTables} =  require('material-ui-datatables');

export class Report extends Other {
    private from_date:Date;
    private to_date;
    private value:string;

    constructor(props,ctx){
        super(props,ctx);
        this.rowSizeList = [100,150,250];
        this.state.rowSize = 100;
        Object.defineProperty(this.state,'snackBar',{
            enumerable:true,
            configurable:true,
            writable:true,
            value:false
        });
    }
    public appendItem(model:Customer){
        let object:any = model.toObject();

        Object.defineProperty(object,'created_at',{
            value :  <span style={{fontSize:11}}><b>{object.created_at}</b></span>
        });
        Object.defineProperty(object,'finished_at',{
            value :  <span style={{fontSize:11}}><b>{object.finished_at}</b></span>
        });
        return object;
    }

    search = value =>{
        this.collection
            .search(value ? value.trim() : null,{
                fromDate:this.from_date,
                toDate : this.to_date
            }).then(r=>{
            setTimeout(()=>{
                this.setState({
                    total:this.collection.length
                })
            })
        }).catch(this.log.error);
    };

    @Bound
    public handleFilterValueChange(value){
        this.value = value;
        if(value && value!=''){
            this.search(value);
        }else if(this.from_date || this.to_date){
            this.search(null);
        }else
        if( typeof value=='string' &&  value.trim() == '' ){
            this.load();
        }

    }
    public handleReset(){
        this.collection
            .select(sql
                .select()
                .field("count(*) as total")
                .where('finished = 1')
            ).then(this.ready);
    }

    public load(page = 1,order = this.order,direction = this.direction){
        this.order = order;
        this.direction = direction;
        let offset =  ((page - 1) * this.state.rowSize);
        this.collection.fetch(sql
            .select()
            .where('finished = 1')
            .offset(offset)
            .order(this.order,this.direction)
            .limit(this.state.rowSize)
        ).catch(this.log.error);
    }
    @Bound
    private handleFilterDate(){
        this.search(this.value);
    }
    @Bound
    private handleExport(){
        this.collection.export(this.value,{
            fromDate:this.from_date,
            toDate:this.to_date
        }).then(data=>{
            if( data && data.length ){
                exporter.downloadCsv(data);
                setTimeout(()=>{
                    this.setState({
                        snackBar: true,
                        snackBarMessage:"Report is exported. Check your Downloads folder"
                    });
                },2000)
            }else{
                this.setState({
                    snackBar: true,
                    snackBarMessage:"There are no report to export"
                });
            }

        }).catch(this.log.error);
    }
    handleRequestClose = () => {
        this.setState({
            snackBar: false,
        });
    };
    public runInterval(){

    }
    render(){
        let state:any = this.state;
        return (
            <Card style={{margin: 40}}>
                <CardHeader
                    title='Report'
                    titleStyle={{fontSize: 20}}
                />
                <CardText>
                    <div>
                        <DatePicker style={{float:"left",marginLeft:15}} onChange={(n,v)=>{this.from_date = v;}} hintText="Select Started At Date From" mode="landscape" />
                        <DatePicker style={{float:"left",marginLeft:15}} onChange={(n,v)=>{this.to_date = v;}} hintText="Select Started At Date To" mode="landscape" />
                        <FlatButton
                            icon ={<ActionUpdateIcon color={green300} />}
                            onTouchTap={this.handleFilterDate}
                        />
                        <RaisedButton
                            style={{float:'right'}}
                            label="Export CSV"
                            labelPosition="before"
                            icon={<ActionExportIcon />}
                            onTouchTap={this.handleExport}
                        />
                    </div>
                    <div style={{clear:'both'}}></div>
                    {
                        (()=>{
                            if( !this.state.ready ){
                                return  (
                                    <div style={{textAlign:'center'}}>
                                        <CircularProgress style={{margin:50}} />
                                    </div>
                                )
                            }
                            return (
                                <DataTables
                                    height={'auto'}
                                    selectable={false}
                                    showRowHover={true}
                                    columns={[
                                    {
                                        key: 'code',
                                        label: 'CODE',
                                        sortable:true
                                    },
                                    {
                                        key: 'name',
                                        label: 'NAME',
                                        sortable:true
                                    },
                                    {
                                        key: 'created_at',
                                        label: 'STARTED AT',
                                        sortable:true
                                    },
                                    {
                                        key: 'finished_at',
                                        label: 'FINISHED AT',
                                        sortable:true
                                    },
                                    {
                                        key: 'price',
                                        label: 'PRICE',
                                        sortable:true
                                    },
                                    {
                                        key: 'category',
                                        label: 'CATEGORY',
                                        sortable:true
                                    },
                                    {
                                        key: 'note',
                                        label: 'NOTE',
                                        sortable:true
                                    }
                                ]}
                                    data={this.state.data}
                                    showCheckboxes={false}
                                    showHeaderToolbar = {true}
                                    onFilterValueChange={this.handleFilterValueChange}
                                    onSortOrderChange={this.handleSortOrderChange}
                                    onNextPageClick = {this.handleNextPage}
                                    onPreviousPageClick = {this.handlePreviousPage}
                                    onRowSizeChange = {this.handleRowSize}
                                    rowSize = {this.state.rowSize}
                                    rowSizeList = {this.rowSizeList}
                                    page={this.state.page}
                                    count={this.state.total}
                                />
                            )
                        })()
                    }

                </CardText>
                <Snackbar
                    open={state.snackBar}
                    message={state.snackBarMessage || ""}
                    autoHideDuration={5000}
                    onRequestClose={this.handleRequestClose}
                />
            </Card>
        )
    }
}