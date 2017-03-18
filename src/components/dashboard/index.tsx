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
import {Alert} from "../helpers/alert";
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import {Other} from "./other";

const {DataTables} =  require('material-ui-datatables');

export class Dashboard extends Component<any,any>{

    public state = {
        alert:{
            open : false,
            messages : []
        },
        slideIndex :0
    };

    @Bound
    public handleChangeTab(value){
        this.setState({
            slideIndex: value,
        });
    };
    @Bound
    public onCloseAlert(){
        this.state.alert.open = false;
    }
    @Bound
    public handleError(e){
        if(Array.isArray(e)){
            this.setState({
                alert:{
                    open:true,
                    messages:e.map(err=>err.message)
                }
            })
        }
    }
    @Cached
    public static get columns(){
        let props:any = Customer.props.slice();
        props.splice(props.indexOf('_id'),1);
        props.splice(props.indexOf('finished'),1);
        props =  props.map(prop=>{
            return {
                key: prop,
                label: prop.toUpperCase(),
                sortable:true
            }
        });
        props.push({
            key: 'action',
            label: 'ACTION',
            sortable:false
        });
        return props;
    }
    public componentDidMount(){

    }

    render(){
        return (
            <Card style={{margin: 40, textAlign: 'left'}}>
                <CardHeader
                    title='Dashboard'
                    titleStyle={{fontSize: 20}}
                />
                <div>
                    <Tabs
                        onChange={this.handleChangeTab}
                        value={this.state.slideIndex}
                    >
                        <Tab label="Other" value={0} />
                        <Tab label="Mafia" value={1} />
                        <Tab label="Event" value={2} />
                        <Tab label="Club" value={3} />
                        <Tab label="Patet" value={4} />
                    </Tabs>
                    <SwipeableViews
                        index={this.state.slideIndex}
                        onChangeIndex={this.handleChangeTab}
                    >
                        <div>
                            <Other onError={this.handleError}  />
                        </div>
                        <div >

                        </div>
                        <div >

                        </div>
                        <div>

                        </div>
                        <div>

                        </div>
                    </SwipeableViews>
                </div>
                <Alert open={this.state.alert.open} onClose={this.onCloseAlert} messages={this.state.alert.messages} />

            </Card>
        )
    }
}