import {Other} from "./other";
import * as React from 'react';
import {Card, CardHeader ,CardText} from 'material-ui/Card';
import {Bound} from "../../utils/bound";
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {lightBlue500} from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';
const {DataTables} =  require('material-ui-datatables');
import {List, ListItem} from 'material-ui/List';
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

export class Event extends Other{
    protected categoryName = 'Event';

    @Bound
    public handleCloseDialog () {
        this.setState({openDialog: false});
    };
    @Bound
    public handleOpenDialog () {
        this.setState({openDialog: true});
    };
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
                onTouchTap={this.handleCloseDialog}
            />,
        ];
        return (
            <div style={{margin:10}}>
                <MobileTearSheet>
                    <List>
                        <Subheader>
                            Events
                        </Subheader>
                        <ListItem primaryText="All mail" rightIcon={<ArrowIcon />} />
                        <ListItem primaryText="Trash" rightIcon={<ArrowIcon />} />
                    </List>
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
                    open={this.state.openDialog}
                    onRequestClose={this.handleCloseDialog}
                >
                    <TimePicker  hintText="12hr Format" />
                    <TimePicker  hintText="12hr Format" />
                    <TextField
                        hintText="Price"
                        floatingLabelText="Started At"
                    />
                </Dialog>
                <Card style={{overflow:'hidden'}}>
                    <CardText>
                        <div style={{width:"100%"}}>
                            <TextField
                                style={{width:'25%',marginLeft:'2%',}}
                                value = {"1111"}
                                disabled={true}
                                floatingLabelText="Started At"
                            />
                            <TextField
                                style={{width:'25%',marginLeft:'2%'}}
                                disabled={true}
                                value = {"1111"}
                                floatingLabelText="Finished At"
                            />
                            <TextField
                                style={{width:'15%',marginLeft:'2%'}}
                                value = {"1111"}
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
            </div>

        )
    }
}