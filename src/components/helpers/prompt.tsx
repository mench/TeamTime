import * as React from 'react';
import {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import WarningIcon from 'material-ui/svg-icons/action/report-problem';
import {orange500} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {lightBlue500} from 'material-ui/styles/colors';
import { confirmable,createConfirmation } from 'react-confirm';
import TextField from 'material-ui/TextField';

const muiTheme = getMuiTheme({
    palette: {
        primary1Color :lightBlue500
    }
});

@confirmable
class PromptDialog extends Component<any,any>{
    state = {
        open: true,
        value:this.props.value
    };

    handleClose  = () => {
        this.setState({open: false});
        this.props.cancel();
    };
    handleAccept = ()=>{
        this.setState({open: false});
        this.props.proceed(this.state.value);
    };
    handleChangeValue = e =>{
        this.state.value = e.target.value;
    };


    render(){
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Ok"
                primary={true}
                onTouchTap={this.handleAccept}
            />
        ];
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <Dialog
                    actions={actions}
                    modal={false}
                    contentStyle={{width:'40%'}}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    <TextField
                        id = "prompt-text-field"
                        style = {{margin:10}}
                        defaultValue={this.state.value}
                        onChange={this.handleChangeValue}
                    />

                </Dialog>
            </MuiThemeProvider>
        )
    }
}

const confirm = createConfirmation(PromptDialog);

export function prompt(value, options = {}) {
    return confirm({ value, options });
}