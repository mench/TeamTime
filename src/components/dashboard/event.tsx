import {Other} from "./other";
import * as React from 'react';
import {Component,PropTypes} from 'react';
import {Card, CardHeader ,CardText} from 'material-ui/Card';
import {Bound} from "../../utils/bound";
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {lightBlue500} from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';
const {DataTables} =  require('material-ui-datatables');
import {List, ListItem,makeSelectable} from 'material-ui/List';
import ArrowIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import {MobileTearSheet} from "../helpers/mobiletearsheet";
import Subheader from 'material-ui/Subheader';
import {red500} from 'material-ui/styles/colors';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TimePicker from 'material-ui/TimePicker';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Cached} from "../../utils/cached";
import {EventCollection} from "../../api/models/events";
import {sql} from "../../api/database/sql";
import {Event as EventModel} from "../../api/models/event";
import {Objects} from "../../utils/objects";
import {System} from "../../system";
import {Customer} from "../../api/models/customer";
import {Relation} from "../../api/models/relation";


let SelectableList:any = makeSelectable(List);
SelectableList = wrapState(SelectableList);

export class Events extends Component<any,any> {

    public static defaultProps = {
        onError : ()=>{}
    };
    public static defaultEvent = {
        name:'',
        start_time:new Date(),
        end_time :null,
        price :null
    };

    public state ={
        openDialog:false,
        open :false,
        currentEvent : null,
        newEvent : Objects.merge({},Events.defaultEvent),
        events :[],
        ready :false
    };
    @Bound
    public handleError(e){
        this.handleCloseDialog();
        if(Array.isArray(e)){
            this.props.onError(e);
        }else {
            System.app.log.error(e);
        }
    }
    @Bound
    public handleCloseDialog () {
        this.setState({openDialog: false});
    };
    @Cached
    public get collection(){
        return new EventCollection();
    }
    @Bound
    public handleOpenDialog () {
        this.state.newEvent = Objects.merge({},Events.defaultEvent);
        this.setState({openDialog: true});
    };
    @Bound
    public ready(){
        let state = {
            events : this.collection,
            ready:true
        };
        this.setState(state);
    }
    @Bound
    public handleItemChange(eventId){
        this.setState({
            currentEvent:this.collection.get(eventId)
        });
    }
    @Bound
    public handleSaveEvent(ev){
        this.collection.fetch(sql.select());
        this.handleCloseDialog();
    }
    @Bound
    public handleSubmitEvent(){
        let event = new EventModel(this.state.newEvent);
        event.save()
            .then(this.handleSaveEvent)
            .catch(this.handleError);
    }
    @Bound
    public handleEventName(e){
        this.state.newEvent.name = e.target.value;
    }
    @Bound
    public handleEventStartTime(n,value){
        this.state.newEvent.start_time = value;
    }
    @Bound
    public handleEventEndTime(n,value){
        this.state.newEvent.end_time = value;
    }
    @Bound
    public handleEventPrice(e){
        this.state.newEvent.price = e.target.value;
    }
    public componentDidMount(){
        this.collection.on('reset',this.ready);
        this.collection.fetch(sql.select());
    }
    public render(){
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleCloseDialog}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleSubmitEvent}
            />,
        ];
        return (
            <div style={{margin:10}}>
                <MobileTearSheet>
                    <SelectableList onChange={this.handleItemChange} defaultValue = {0} >
                        <Subheader>
                            Events
                        </Subheader>
                        {
                            this.state.events.map((event:EventModel,i)=>{
                                return (
                                    <ListItem value={event.getId()} key={event.getId()} primaryText={event.name} rightIcon={<ArrowIcon />} />
                                )
                            })
                        }
                    </SelectableList>
                    <div style={{textAlign:"right",marginRight:22}}>
                        <FloatingActionButton mini={true} onClick={this.handleOpenDialog} secondary={true} >
                            <ContentAdd />
                        </FloatingActionButton>
                    </div>
                </MobileTearSheet>
                <Dialog
                    title="Create Event"
                    actions={actions}
                    modal={false}
                    contentStyle={{width:'25%'}}
                    open={this.state.openDialog}
                    onRequestClose={this.handleCloseDialog}
                >
                    <TextField
                        hintText="Name"
                        floatingLabelText="Event Name"
                        onChange ={this.handleEventName}
                    />
                    <TimePicker  onChange ={this.handleEventStartTime} hintText="Start Time" defaultTime={new Date()} />
                    <TimePicker  onChange ={this.handleEventEndTime} hintText="End Time" />
                    <TextField
                        onChange ={this.handleEventPrice}
                        hintText="Price"
                        floatingLabelText="Price"
                    />
                </Dialog>
                <div style={{margin:10}}>
                    {
                        (()=>{
                            if( this.state.currentEvent ){
                                return <Event key={this.state.currentEvent.getId()} data={this.state.currentEvent} onError={this.handleError} />
                            }
                            return <div></div>
                        })()
                    }

                </div>
            </div>
        )
    }
}

export class Event extends Other{
    protected categoryName = 'Event';
    public static defaultProps = {
        onError : ()=>{},
        data : new EventModel()
    };
    @Bound
    public async onSubmit(e){
        e.preventDefault();
        this.state.fields.category = this.categoryName;
        let model:Customer = new Customer(this.state.fields);
        this.collection.tableName = "customers";
        let exist = await this.collection.fetchByCode(model.code);
        if ( exist ){
            return this.handleError([
                {
                    message: `code ${model.code} already exist in the active list. Please finish and try again.`
                }
            ])
        }
        let customer:any = await model.save()
            .catch(this.handleError);
        let relation = new Relation({
            event_id:this.props.data.getId(),
            customer_id:customer.getId()
        });
        relation.save()
            .then(r=>{
                this.load(this.state.page);
            })
            .catch(this.handleError)
    }

    public handleReset(){
        this.collection.tableName = 'relations';
        this.collection
            .select(sql
                .select()
                .field("count(*) as total")
                .where('event_id = ?',this.props.data.getId())
            ).then(this.ready)
            .catch(System.app.log.error);
    }
    public load(page = 1,order = this.order,direction = this.direction){
        this.order = order;
        this.direction = direction;
        let offset =  ((page - 1) * this.state.rowSize);
        this.collection.tableName = 'relations';
        this.collection.fetch(sql
            .select()
            .field('customers.*')
            .field('event_id')
            .left_join('customers',null,'relations.customer_id = customers.id')
            .where('event_id = ?',this.props.data.getId())
            .offset(offset)
            .order(this.order,this.direction)
            .limit(this.state.rowSize)
        ).catch(System.app.log.error);
    }
    public appendItem(model:Customer){
        let object:any = model.toObject();
        Object.defineProperty(object,'action',{
            value :  <RaisedButton label="FINISH" secondary={true} />
        });
        Object.defineProperty(object,'created_at',{
            value :  <span style={{fontSize:11}}><b>{model.getShortCreatedAt()}</b></span>
        });
        return object;
    }
    public render(){
        return (
            <Card style={{overflow:'hidden'}}>
                <CardText>
                    <div style={{width:"100%"}}>
                        <TextField
                            style={{width:'25%',marginLeft:'2%',}}
                            value = {this.props.data.getStartTime()}
                            disabled={true}
                            floatingLabelText="Started At"
                        />
                        <TextField
                            style={{width:'25%',marginLeft:'2%'}}
                            disabled={true}
                            value = {this.props.data.getEndTime()}
                            floatingLabelText="Finished At"
                        />
                        <TextField
                            style={{width:'15%',marginLeft:'2%'}}
                            value = {this.props.data.price}
                            disabled={true}
                            floatingLabelText="Price"
                        />
                        <RaisedButton
                            buttonStyle={{backgroundColor:red500}}
                            label="Delete Event"
                            labelPosition="before"
                            primary={true}
                            icon={<ActionDelete />}
                            style={{marginLeft:'2%'}}
                        />
                    </div>
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

function wrapState(ComposedComponent) {
    return class SelectableList extends Component<any,any> {
        static defaultProps = {
            onChange :()=>{}
        };

        static propTypes = {
            children: PropTypes.node.isRequired,
            defaultValue: PropTypes.number.isRequired,
        };

        componentWillMount() {
            this.setState({
                selectedIndex: this.props.defaultValue,
            });
        }

        handleRequestChange = (event, index) => {
            this.setState({
                selectedIndex: index,
            });
            this.props.onChange(index);
        };

        render() {
            return (
                <ComposedComponent
                    value={this.state.selectedIndex}
                    onChange={this.handleRequestChange}
                >
                    {this.props.children}
                </ComposedComponent>
            );
        }
    };
}