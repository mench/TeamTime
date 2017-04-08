import * as React from 'react';
import {Component} from 'react';
import {Card, CardHeader ,CardText} from 'material-ui/Card';
import {Bound} from "../../utils/bound";
import TextField from 'material-ui/TextField';
import NumberInput from 'material-ui-number-input';
import RaisedButton from 'material-ui/RaisedButton';
import {lightBlue500} from 'material-ui/styles/colors';
import {red500} from 'material-ui/styles/colors';
import {green500} from 'material-ui/styles/colors';
import {Customer} from "../../api/models/customer";
import {Cached} from "../../utils/cached";
import {CustomerCollection} from "../../api/models/customers";
import {Tabs, Tab} from 'material-ui/Tabs';
import CircularProgress from 'material-ui/CircularProgress';
import {sql} from "../../api/database/sql";
import {System} from "../../system";
import {Log} from "../../helpers/logger";
import EditIcon from 'material-ui/svg-icons/image/edit';
import {prompt} from "../helpers/prompt";
import {confirm} from "../helpers/confirm";

const {DataTables} =  require('material-ui-datatables');

export class Other extends Component<any,any>{
    protected rowSizeList = [30,50,100];
    protected categoryName = 'Other';
    protected order = 'created_at';
    protected direction = false;
    protected loop = null;
    public static defaultProps = {
        onError : ()=>{}
    };

    public state = {
        data    : [],
        total   : 0,
        page    : 1,
        rowSize : 30,
        ready : false,
        editNote : false,
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
        }else{
            System.app.log.error(e);
        }
    }

    public async onSubmit(e){
        e.preventDefault();
        this.state.fields.category = this.categoryName;
        let model:Customer = new Customer(this.state.fields);
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
    public handleSortOrderChange(order,direction:string){
        this.load(this.state.page,order,direction.toLowerCase() != 'desc');
    }
    @Cached
    public get collection(){
        return new CustomerCollection();
    }
    public runInterval(){
        this.loop = setInterval(()=>{
            this.collection.emit('tick');
        },5000);
        this.collection.on('tick',()=>this.onTick());
    }
    public onTick(){
        this.setState({
            data : this.collection.map(this.appendItem.bind(this))
        });
    }
    public componentDidMount(){
        this.collection.on('reset',this.handleReset.bind(this));
        this.collection.on('change',()=>{
            this.setState({
                data : this.collection.map(this.appendItem.bind(this))
            });
        });
        this.runInterval();
        this.load(this.state.page);
    }
    public componentWillUnmount(){
        clearInterval(this.loop);
    }
    @Bound
    public ready(res){
        let state = {
            ready : true,
            total:res.total,
            currentSum:this.collection.totalPrice(),
            fields  : {
                code:"",
                name:"",
                note:""
            },
            data : this.collection
                .map(this.appendItem.bind(this))
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

    handleEditNote (id,value){
        let _id = id;
        prompt(value).then(val=>{
            let model = this.collection.get(_id);
            model.set('note',val);
            model.save();
        },r=>{});
    };
    handleEditname (id,value){
        let _id = id;
        prompt(value).then(val=>{
            let model = this.collection.get(_id);
            model.set('name',val);
            model.save();
        },r=>{});
    };

    public handleFinish(model:Customer){
        let price = model.getPrice();
        confirm(<span><span>Total price is</span><h2><NumberInput defaultValue={price} id={`total-price-${model.id}`}  strategy="ignore" /><span style={{fontSize:12}}>&nbsp;AMD</span></h2></span>,{success:true})
            .then(r=>{
                let input:any = document.getElementById(`total-price-${model.id}`);
                this.finished(input.value,model);
            },e=>{});
    }
    public finished(price:number,model:Customer){
        this.collection.remove(model);
        model.set({
            real_price : model.getPrice(),
            price:price,
            finished_at:Date.now(),
            finished : true
        }).save().then(r=>{
            this.log.info('FINISHED',model.id,model.code);
            this.load(this.state.page);
        }).catch(this.log.error);
    }

    public appendItem(model:Customer){
        let object:any = model.toObject();
        Object.defineProperty(object,'action',{
            value :  <RaisedButton label="FINISH" onTouchTap={()=>this.handleFinish(model)} secondary={true} />
        });
        Object.defineProperty(object,'created_at',{
            value :  <span style={{fontSize:11}}><b>{object.created_at}</b></span>
        });
        let note = object.note;
        Object.defineProperty(object,'note',{
            value :<span>{object.note} <div style={{float:'right'}}><a href="javascript:;" data-id={object.id} onClick={()=>this.handleEditNote(object.id,note)}><EditIcon viewBox = {'0 0 35 10'} /></a></div></span>
        });
        let name = object.name;
        Object.defineProperty(object,'name',{
            value :<span>{object.name} <div style={{float:'right'}}><a href="javascript:;" data-id={object.id} onClick={()=>this.handleEditname(object.id,name)}><EditIcon viewBox = {'0 0 35 10'} /></a></div></span>
        });
        return object;
    }

    public handleReset(){
        this.collection
            .select(sql
                .select()
                .field("count(*) as total")
                .where('category = ?',this.categoryName)
                .where('finished = "false"')
            ).then(this.ready);
    }
    @Cached
    public get log():Log {
        return System.app.log;
    }
    public load(page = 1,order = this.order,direction = this.direction){
        this.order = order;
        this.direction = direction;
        let offset =  ((page - 1) * this.state.rowSize);
        this.collection.fetch(sql
            .select()
            .where('category = ?',this.categoryName)
            .where('finished = "false"')
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
                    <form onSubmit={this.onSubmit.bind(this)} >
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