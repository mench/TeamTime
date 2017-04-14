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
import DeleteIcon from 'material-ui/svg-icons/content/clear';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {green300} from 'material-ui/styles/colors';
import {red500} from 'material-ui/styles/colors';
import Snackbar from 'material-ui/Snackbar';
import {confirm} from "../helpers/confirm";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import EditIcon from 'material-ui/svg-icons/image/edit';
import NumberInput from 'material-ui-number-input';
import Dialog from 'material-ui/Dialog';

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
    private category;
    private value:string;

    constructor(props,ctx){
        super(props,ctx);
        this.rowSizeList = [100,150,250];
        this.state.rowSize = 100;
        Object.defineProperties(this.state,{
            snackBar:{
                enumerable:true,
                configurable:true,
                writable:true,
                value:false
            },
            categoryFilter:{
                enumerable:true,
                configurable:true,
                writable:true,
                value:null
            },
            currentSum:{
                enumerable:true,
                configurable:true,
                writable:true,
                value:0
            },
            requiredName:{
                enumerable:true,
                configurable:true,
                writable:true,
                value:""
            },
            requiredPayed:{
                enumerable:true,
                configurable:true,
                writable:true,
                value:""
            },
            changedData :{
                enumerable:true,
                configurable:true,
                writable:true,
                value:{}
            },
            modal :{
                enumerable:true,
                configurable:true,
                writable:true,
                value:(<div></div>)
            },
            openModal :{
                enumerable:true,
                configurable:true,
                writable:true,
                value:false
            },
            modalData:{
                enumerable:true,
                configurable:true,
                writable:true,
                value:{
                    name:"",
                    note:"",
                    price:"",
                    phone:""
                }
            }
        });
    }
    handleChangeField = (key,value) =>{
        let state:any = this.state;
        state.changedData[key] = value;
    };
    @Bound
    private handleEdit(model:Customer){
        this.setState({
            openModal:true,
            modalData:{
                model:model,
                name:model.name,
                price:model.price,
                note:model.note,
                phone:model.phone
            },
            changedData:{
                name:model.name,
                price:model.price,
                note:model.note,
                phone:model.phone
            }
        });
    }
    public appendItem(model:Customer){
        let object:any = model.toObject();

        Object.defineProperty(object,'created_at',{
            value :  <span style={{fontSize:9}}><b>{object.created_at}</b></span>
        });
        Object.defineProperty(object,'finished_at',{
            value :  <span style={{fontSize:9}}><b>{object.finished_at}</b></span>
        });
        Object.defineProperty(object,'action',{
            value :  (
                <div>
                    <FlatButton style={{width:35,minWidth:35}}  onTouchTap={()=>{ this.handleEdit(model); }}  icon={<EditIcon />} />
                    <FlatButton style={{width:35,minWidth:35}} onTouchTap={()=>{ this.handleDelete(model); }} icon={<DeleteIcon color={red500} />} />
                </div>
            )
        });
        return object;
    }

    search = value =>{
        this.collection
            .search(value ? value.trim() : null,{
                fromDate:this.from_date,
                toDate : this.to_date,
                category:this.category
            }).then(r=>{
            setTimeout(()=>{
                this.setState({
                    total:this.collection.length
                })
            })
        }).catch(this.log.error);
    };
    @Bound
    private handleDelete(model:Customer){
        confirm("Are you sure you wont to delete this item?")
            .then(ok=>{
                model.destroy();
            },e=>{})
    }
    @Bound
    public handleFilterValueChange(value){
        this.value = value;
        if(value && value!=''){
            this.search(value);
        }else if(this.from_date || this.to_date || this.category){
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
                .where('finished = "true"')
            ).then(this.ready);
    }

    public load(page = 1,order = this.order,direction = this.direction){
        this.order = order;
        this.direction = direction;
        let offset =  ((page - 1) * this.state.rowSize);
        this.collection.fetch(sql
            .select()
            .where('finished = "true"')
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
    @Bound
    private handleChangeFilterCategory(event, index, value){
        this.category = value;
        this.setState({
            categoryFilter:value
        });
        this.search(this.value);
    }
    public componentDidMount(){
        super.componentDidMount();
        this.collection.on('remove',()=>{
            this.collection.emit('reset');
        });
    }
    handleCloseModal  = () => {
        this.setState({openModal: false});
    };
    handleAcceptModal = ()=>{
        let state:any = this.state;
        let error = false;

        if( state.changedData ){
            if( !state.changedData.name || ( typeof state.changedData.name =='string' && state.changedData.name.trim() == '') ){
                error = true;
                this.setState({
                    requiredName:'This field is required'
                })
            }
            if( !state.changedData.price || ( typeof state.changedData.price =='string' && state.changedData.price.trim() == '') ){
               error = true;
               this.setState({
                    requiredPayed:'This field is required'
                })
            }
            if( !error ){
                state.modalData.model.set(state.changedData).save();
                this.setState({
                    requiredPayed:"",
                    requiredName: "",
                    openModal: false
                });
            }

        }else{
            this.setState({openModal: false});
        }
    };
    render(){
        let state:any = this.state;
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleCloseModal}
            />,
            <FlatButton
                label="Ok"
                primary={true}
                onTouchTap={this.handleAcceptModal}
            />
        ];
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
                    <div style={{
                            marginLeft: 17,
                            float: 'left',
                            clear: 'both'
                        }}>
                        <SelectField
                            floatingLabelText="Filter By Category"
                            value={state.categoryFilter}
                            onChange={this.handleChangeFilterCategory}
                        >
                            <MenuItem value={null} primaryText={""} />
                            {
                                ['Mafia','Other','Event','Club','Package'].map(c=>{
                                    return  <MenuItem key={c} value={c} primaryText={c} />
                                })
                            }
                        </SelectField>
                    </div>
                    <div style={{
                            marginLeft: 17,
                            float: 'left',
                            clear: 'both'
                        }}>
                        <TextField
                            hintText="Current Sum"
                            value = {state.currentSum}
                            floatingLabelText="Current Sum"
                            disabled = {true}
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
                                        key: 'real_price',
                                        label: 'PRICE',
                                        sortable:true
                                    },
                                    {
                                        key: 'price',
                                        label: 'PAYED',
                                        sortable:true
                                    },
                                    {
                                        key: 'category',
                                        label: 'CATEGORY',
                                        sortable:true
                                    },
                                    {
                                        key: 'phone',
                                        label: 'PHONE',
                                        sortable:true
                                    },
                                    {
                                        key: 'note',
                                        label: 'NOTE',
                                        sortable:true
                                    },
                                    {
                                        key: 'action',
                                        label: 'ACTION',
                                        sortable:false
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
                <Dialog
                    actions={actions}
                    modal={false}
                    contentStyle={{width:'40%'}}
                    open={state.openModal}
                    onRequestClose={this.handleCloseModal}
                >
                    <div style={{lineHeight:1.5,margin:"1em"}}>
                        {(()=>{
                            if(state.openModal){
                                return (
                                    <div>
                                        <TextField
                                            hintText="Name"
                                            defaultValue = {state.modalData.name}
                                            onChange={(e:any)=>{ this.handleChangeField('name',e.target.value) }}
                                            errorText={state.requiredName}
                                            floatingLabelText="Name"
                                        />
                                        <TextField
                                            hintText="Phone"
                                            defaultValue = {state.modalData.phone}
                                            onChange={(e:any)=>{ this.handleChangeField('phone',e.target.value) }}
                                            floatingLabelText="Phone"
                                        />
                                        <NumberInput
                                            hintText="Payed"
                                            strategy="ignore"
                                            defaultValue = {state.modalData.price}
                                            errorText={state.requiredPayed}
                                            onChange={(e:any)=>{ this.handleChangeField('price',e.target.value) }}
                                            floatingLabelText="Payed"
                                        />
                                        <TextField
                                            hintText="Note"
                                            defaultValue = {state.modalData.note}
                                            onChange={(e:any)=>{ this.handleChangeField('note',e.target.value) }}
                                            floatingLabelText="Note"
                                        />
                                    </div>
                                )
                            }
                            return <div></div>
                        })()}
                    </div>
                </Dialog>
            </Card>
        )
    }
}