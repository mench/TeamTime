import * as React from 'react';
import {Component} from 'react';
import {Card, CardHeader ,CardText} from 'material-ui/Card';
import {Bound} from "../../utils/bound";
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {lightBlue500} from 'material-ui/styles/colors';
import {red500} from 'material-ui/styles/colors';
import {Customer} from "../../api/models/customer";
import {Cached} from "../../utils/cached";
import {Customers} from "../../api/models/customers";
import {Tabs, Tab} from 'material-ui/Tabs';
import CircularProgress from 'material-ui/CircularProgress';
import {sql} from "../../api/database/sql";
import {System} from "../../system";
import {Log} from "../../helpers/logger";

const {DataTables} =  require('material-ui-datatables');

export class Other extends Component<any,any>{
    protected rowSizeList = [30,50,100];
    protected categoryName = 'Other';
    protected order = 'created_at';
    protected direction = false;
    public static defaultProps = {
        onError : ()=>{}
    };

    public state = {
        data    : [],
        total   : 0,
        page    : 1,
        rowSize : 30,
        ready : false,
        openDialog:false,
        fields  : {
            code:"",
            name:"",
            note:"",
            category:this.categoryName
        }
    };
    @Bound
    public handleError(e){
        if(Array.isArray(e)){
            this.props.onError(e);
        }
    }
    @Bound
    public async onSubmit(e){
        e.preventDefault();
        this.state.fields.category = this.categoryName;
        let model:Customer = new Customer(this.state.fields);
        console.info(model.created_at)
        let exist = await this.collection.fetchByCode(model.code);
        if ( exist ){
            return this.handleError([
                {
                    message: `code ${model.code} already exist in the active list. Please finish and try again.`
                }
            ])
        }
        model.save()
            .then(m=>{
                this.load(this.state.page);
            })
            .catch(this.handleError);
    }
    @Bound
    public handleCodeChange(e){
        this.state.fields.code = e.target.value;
        this.setState({
            fields:this.state.fields
        })
    }
    @Bound
    public handleNameChange(e){
        this.state.fields.name = e.target.value;
        this.setState({
            fields:this.state.fields
        })
    }
    @Bound
    public handleNoteChange(e){
        this.state.fields.note = e.target.value;
        this.setState({
            fields:this.state.fields
        })
    }
    @Bound
    public handleFilterValueChange(){
        console.info('handleFilterValueChange')
    }
    @Bound
    public handleSortOrderChange(order,direction:string){
        this.load(this.state.page,order,direction.toLowerCase() != 'desc');
    }
    @Cached
    public get collection(){
        return new Customers();
    }
    public componentDidMount(){
        console.info("componentDidMount")
        this.collection.on('reset',this.handleReset);
        this.load(this.state.page);
    }
    @Bound
    public ready(res){
        let state = {
            ready : true,
            total:res.total,
            fields  : {
                code:"",
                name:"",
                note:""
            },
            data : this.collection
                .map((model:Customer)=>{
                    let object:any = model.toObject();
                    Object.defineProperty(object,'action',{
                        value :  <RaisedButton label="FINISH" secondary={true} />
                    });
                    Object.defineProperty(object,'created_at',{
                        value :  <span style={{fontSize:11}}><b>{object.created_at}</b></span>
                    });
                    return object;
                })
        };
        if ( !this.state.ready ){
            this.state.ready = true;
            setTimeout(()=>{
                this.setState(state);
            },400);
        }else {
            this.setState(state);
        }
    }
    @Bound
    public handleReset(){
        this.collection
            .select(sql
                .select()
                .field("count(*) as total")
                .where('category = ?',this.categoryName)
            ).then(this.ready);
    }
    @Cached
    private get log():Log {
        return System.app.log;
    }
    public load(page = 1,order = this.order,direction = this.direction){
        this.order = order;
        this.direction = direction;
        let offset =  ((page - 1) * this.state.rowSize);
        this.collection.fetch(sql
            .select()
            .where('category = ?',this.categoryName)
            .offset(offset)
            .order(this.order,this.direction)
            .limit(this.state.rowSize)
        ).catch(this.log.error);
    }
    @Bound
    public handleNextPage(){
        this.state.page+=1;
        this.load(this.state.page,this.order,this.direction);
    }
    @Bound
    public handlePreviousPage(){
        this.state.page-=1;
        this.load(this.state.page,this.order,this.direction);
    }
    @Bound
    public handleRowSize(index){
       let size = this.rowSizeList[index];
       this.state.rowSize = size;
       this.state.page = 1;
       this.setState({
           rowSize:size,
           page :1
       });
       this.load(this.state.page,this.order,this.direction);
    }
    public render(){
        return (
            <Card style={{textAlign:'center',overflow:'hidden'}}>
                <CardText>
                    <form onSubmit={this.onSubmit} >
                        <TextField
                            style={{width:'15%',marginLeft:'2%',}}
                            hintText="Code"
                            value = {this.state.fields.code}
                            onChange={this.handleCodeChange}
                            floatingLabelText="Customer Code"
                        />
                        <TextField
                            style={{width:'25%',marginLeft:'2%'}}
                            hintText="Name"
                            value = {this.state.fields.name}
                            onChange={this.handleNameChange}
                            floatingLabelText="Customer Name"
                        />
                        <TextField
                            style={{width:'30%',marginLeft:'2%'}}
                            hintText="Note"
                            value = {this.state.fields.note}
                            onChange={this.handleNoteChange}
                            floatingLabelText="Customer Note"
                        />
                        <RaisedButton type="submit" label="Add" primary={true}  style={{width:'17%',marginLeft:'2%'}} />
                    </form>
                </CardText>
                {
                    (()=>{
                        if( !this.state.ready ){
                            return  <CircularProgress style={{margin:50}} />
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
                                        key: 'price',
                                        label: 'PRICE',
                                        sortable:false
                                    },
                                    {
                                        key: 'note',
                                        label: 'NOTE',
                                        sortable:true
                                    },
                                    {
                                        key : 'action',
                                        label: 'ACTION',
                                        sortable:false
                                    }
                                ]}
                                data={this.state.data}
                                showCheckboxes={false}
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
            </Card>
        )
    }
}