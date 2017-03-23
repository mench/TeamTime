import * as React from 'react';
import {Component} from 'react';
import {Card, CardHeader ,CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import NumberInput from 'material-ui-number-input';
import {Bound} from "../../utils/bound";
import TimePicker from 'material-ui/TimePicker';
import {System} from "../../system";
import RaisedButton from 'material-ui/RaisedButton';
import {Objects} from "../../utils/objects";
import Snackbar from 'material-ui/Snackbar';

export class Settings extends Component<any,any>{

    private data = Objects.merge({},System.app.settings.data);
    public state = {
        open: false,
    };

    @Bound
    private handleChangeOtherMinimum(e){
        this.data.other.minimum = this.formatNumber(e.target.value);
    }
    @Bound
    private handleChangeOtherOneHour(e){
        this.data.other.oneHour = this.formatNumber(e.target.value);
    }
    @Bound
    private handleChangeClubOneHour(e){
        this.data.club.oneHour = this.formatNumber(e.target.value);
    }
    @Bound
    private handleChangePackageTotalPrice(e){
        this.data.package.totalPrice = this.formatNumber(e.target.value);
    }
    @Bound
    private handleChangePackageFinishHour(e){
        this.data.package.finish_hour = this.formatNumber(e.target.value);
    }
    @Bound
    private handleMafiaThursdayStartTime(n,value:Date){
        this.data.mafia.THURSDAY.start_time = this.reformatTime(value);
    }
    @Bound
    private handleMafiaThursdayEndTime(n,value:Date){
        this.data.mafia.THURSDAY.end_time = this.reformatTime(value);
    }
    @Bound
    private handleMafiaSundayStartTime(n,value:Date){
        this.data.mafia.SUNDAY.start_time = this.reformatTime(value);
    }
    @Bound
    private handleMafiaSundayEndTime(n,value:Date){
        this.data.mafia.SUNDAY.end_time = this.reformatTime(value);
    }
    @Bound
    private handleMafiaThursdayTotalPrice(e){
        this.data.mafia.THURSDAY.totalPrice = this.formatNumber(e.target.value);
    }
    @Bound
    private handleMafiaSundayTotalPrice(e){
        this.data.mafia.SUNDAY.totalPrice = this.formatNumber(e.target.value);
    }
    @Bound
    private handleSaveSettings(e){
        System.app
            .settings
            .write(this.data)
            .then(r=>{
                this.setState({
                    open: true,
                });
            }).catch(System.app.log.error)
    }
    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };
    formatNumber = value =>{
        return Number(value) || 0;
    };
    reformatTime = d => {
        return {
            "hours"   : d.getHours(),
            "minutes" : d.getMinutes()
        }
    };
    formatTime = d =>{
        let date = new Date();
        date.setHours(d.hours);
        date.setMinutes(d.minutes);
        return date;
    };
    render(){
        let settings = System.app.settings.data;

        return (
            <Card style={{margin: 40}}>
                <CardHeader
                    title='Settings'
                    titleStyle={{fontSize: 20}}
                />
                <CardText>
                    <div style={{textAlign :'right'}}>
                        <RaisedButton
                            label="Save Settings"
                            labelPosition="before"
                            primary={true}
                            onClick = {this.handleSaveSettings}
                            style={{marginLeft:'2%'}}
                        />
                    </div>
                    <div>
                        <h4>Other</h4>
                        <NumberInput
                            id = "minimum-text-field"
                            hintText="Minimum Price"
                            style = {{marginRight:10}}
                            strategy="ignore"
                            defaultValue = {settings.other.minimum}
                            floatingLabelText="Minimum Price"
                            onChange={this.handleChangeOtherMinimum}
                        />
                        <NumberInput
                            id = "oneHour-text-field"
                            style = {{marginRight:10}}
                            hintText="Price for an hour"
                            strategy="ignore"
                            defaultValue = {settings.other.oneHour}
                            floatingLabelText="Price for an hour"
                            onChange={this.handleChangeOtherOneHour}
                        />
                    </div>
                    <div>
                        <h4>Club</h4>
                        <NumberInput
                            id = "oneHour-club-text-field"
                            style = {{marginRight:10}}
                            hintText="Price for an hour"
                            strategy="ignore"
                            defaultValue = {settings.club.oneHour}
                            floatingLabelText="Price for an hour"
                            onChange={this.handleChangeClubOneHour}
                        />
                    </div>
                    <div>
                        <h4>Mafia</h4>
                        <p>Thursday</p>
                        <TimePicker
                            onChange ={this.handleMafiaThursdayStartTime}
                            value = {this.formatTime(settings.mafia.THURSDAY.start_time)}
                            id="Mafia-Thursday-start-time"
                            hintText="Start Time"
                        />
                        <TimePicker
                            onChange ={this.handleMafiaThursdayEndTime}
                            value = {this.formatTime(settings.mafia.THURSDAY.end_time)}
                            id="Mafia-Thursday-end-time"
                            hintText="End Time"
                        />
                        <NumberInput
                            id = "total---price-text-field"
                            style = {{marginRight:10}}
                            hintText="Price"
                            strategy="ignore"
                            defaultValue = {settings.mafia.THURSDAY.totalPrice}
                            floatingLabelText="Price"
                            onChange={this.handleMafiaThursdayTotalPrice}
                        />
                        <p>Sunday</p>
                        <TimePicker
                            onChange ={this.handleMafiaSundayStartTime}
                            value = {this.formatTime(settings.mafia.SUNDAY.start_time)}
                            id="Mafia-Sunday-start-time"
                            hintText="Start Time"
                        />
                        <TimePicker
                            onChange ={this.handleMafiaSundayEndTime}
                            value = {this.formatTime(settings.mafia.SUNDAY.end_time)}
                            id="Mafia-Sunday-end-time"
                            hintText="End Time"
                        />
                        <NumberInput
                            id = "total--Sunday-price-text-field"
                            style = {{marginRight:10}}
                            hintText="Price"
                            strategy="ignore"
                            defaultValue = {settings.mafia.THURSDAY.totalPrice}
                            floatingLabelText="Price"
                            onChange={this.handleMafiaSundayTotalPrice}
                        />
                    </div>
                    <h4>Package</h4>
                    <NumberInput
                        id = "minimum-p-text-field"
                        hintText="Total Price"
                        style = {{marginRight:10}}
                        strategy="ignore"
                        defaultValue = {settings.package.totalPrice}
                        floatingLabelText="Total Price"
                        onChange={this.handleChangePackageTotalPrice}
                    />
                    <NumberInput
                        id = "minimum-p-text-field"
                        hintText="Total Price"
                        style = {{marginRight:10}}
                        strategy="ignore"
                        defaultValue = {settings.package.finish_hour}
                        floatingLabelText="Duration (in hour)"
                        onChange={this.handleChangePackageFinishHour}
                    />
                    <div style={{textAlign :'right'}}>
                        <RaisedButton
                            label="Save Settings"
                            labelPosition="before"
                            primary={true}
                            onClick = {this.handleSaveSettings}
                            style={{marginLeft:'2%'}}
                        />
                    </div>
                    <Snackbar
                        open={this.state.open}
                        message="Settings Successfully Saved."
                        autoHideDuration={4000}
                        onRequestClose={this.handleRequestClose}
                    />
                </CardText>
            </Card>
        )
    }
}