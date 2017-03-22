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
const muiTheme = getMuiTheme({
    palette: {
        primary1Color :lightBlue500
    }
});
@confirmable
class ConfirmDialog extends Component<any,any>{
    state = {
        open: true
    };

    handleClose  = () => {
        this.setState({open: false});
        this.props.cancel();
    };
    handleAccept = ()=>{
        this.setState({open: false});
        this.props.proceed();
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
                <WarningIcon color={orange500} /> <span style={{position:"relative",top:-5}}>Confirmation</span>
                <p style={{color:orange500,lineHeight:1.5}}>
                    {this.props.confirmation}
                </p>

            </Dialog>
        </MuiThemeProvider>
        )
    }
}

const __confirm = createConfirmation(ConfirmDialog);

export function confirm(confirmation, options = {}) {
   return __confirm({ confirmation, options });
}