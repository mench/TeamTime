import * as React from 'react';
import {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Bound} from "../../utils/bound";
import WarningIcon from 'material-ui/svg-icons/action/report-problem';
import {red500} from 'material-ui/styles/colors';

export class Alert extends Component<any,any> {
    static defaultProps = {
        messages: [],
        open : false,
        onClose : e => {}
    };
    state = {
        open: this.props.open
    };
    componentWillReceiveProps(props){
        this.state.open = props.open;
    }
    @Bound
    handleOpen() {
        this.setState({open: true});
    };
    @Bound
    handleClose () {
        this.setState({open: false});
        this.props.onClose();
    };
    render() {
        const actions = [
            <FlatButton
                label="Ok"
                primary={true}
                onTouchTap={this.handleClose}
            />
        ];
        return (
            <div>
                <Dialog
                    actions={actions}
                    modal={false}
                    contentStyle={{width:'35%'}}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                     <WarningIcon color={red500} /> <span style={{position:"relative",top:-5}}>Validation failed</span>
                    <ul>
                        {
                            this.props.messages.map((m,i)=><li key={i} style={{marginTop:5,lineHeight: 1.3,color:red500}}>{m}</li>)
                        }
                    </ul>

                </Dialog>
            </div>
        );
    }

}