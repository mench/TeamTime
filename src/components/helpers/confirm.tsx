import * as React from 'react';
import {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import WarningIcon from 'material-ui/svg-icons/action/report-problem';
import SuccessIcon from 'material-ui/svg-icons/action/done';
import {orange500} from 'material-ui/styles/colors';
import {green500} from 'material-ui/styles/colors';
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
                {
                    (()=>{
                      if( this.props.options.success ){
                          return <SuccessIcon color={green500} />
                      }
                      return  <WarningIcon color={orange500} />
                    })()
                }
                <span style={{position:"relative",top:-5}}>Confirmation</span>
                <div style={{color:this.props.options.success ? green500 : orange500,lineHeight:1.5,margin:"1em"}}>
                    {this.props.confirmation}
                </div>

            </Dialog>
        </MuiThemeProvider>
        )
    }
}

const __confirm = createConfirmation(ConfirmDialog);

export function confirm(confirmation, options = {}) {
   return __confirm({ confirmation, options });
}