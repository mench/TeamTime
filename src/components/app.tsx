import * as React from 'react';
import {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {lightBlue500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import HistoryIcon from 'material-ui/svg-icons/action/history';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import {Bound} from "../utils/bound";
import {Dashboard} from "./dashboard";
import {Report} from "./report";
import {Settings} from "./settings/index";

injectTapEventPlugin();

const muiTheme = getMuiTheme({
    palette: {
        primary1Color :lightBlue500
    }
});
const WINDOWS = {
    DASHBOARD       : 'Dashboard',
    REPORT          : 'Report',
    SETTINGS        : 'Settings'
};

export class App extends Component<any,any>{

    public state = {
        isOpenMenu:false,
        window:WINDOWS.DASHBOARD,
    };
    @Bound
    public handleTouchTap(task) {
        this.setState({
            isOpenMenu:true
        })
    }
    @Bound
    public handleCloseDrawer(){
        this.setState({
            isOpenMenu:false
        })
    }
    @Bound
    public openDashboard(){
        this.openWindow(WINDOWS.DASHBOARD);
    }
    @Bound
    openReport(){
        this.openWindow(WINDOWS.REPORT);
    }
    @Bound
    openSettings(){
        this.openWindow(WINDOWS.SETTINGS);
    }
    private openWindow(window){
        this.setState({
            window:window,
            isOpenMenu:false
        })
    }
    public render(){
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <AppBar onLeftIconButtonTouchTap={this.handleTouchTap} />
                    <Drawer open={this.state.isOpenMenu} docked={false} onRequestChange={this.handleCloseDrawer} >
                        <MenuItem onTouchTap={this.openDashboard} leftIcon={<DashboardIcon />} >Dashboard</MenuItem>
                        <MenuItem onTouchTap={this.openReport} leftIcon={<HistoryIcon />} >Reports</MenuItem>
                        <MenuItem onTouchTap={this.openSettings} leftIcon={<SettingsIcon />} >Settings</MenuItem>
                    </Drawer>
                    {
                        (()=>{
                            switch (this.state.window){
                                case WINDOWS.DASHBOARD :
                                    return <Dashboard />
                                case WINDOWS.REPORT :
                                    return <Report />
                                case WINDOWS.SETTINGS :
                                    return <Settings />
                            }
                        })()
                    }
                </div>
            </MuiThemeProvider>
        )
    }
}
