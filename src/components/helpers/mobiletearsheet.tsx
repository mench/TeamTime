import * as React from 'react';
import {Component} from 'react';

export class MobileTearSheet extends Component<any,any>{
    static defaultProps = {
        height: 500
    }

    render() {

        let styles = {
            root: {
                float: 'left',
                marginBottom: 24,
                marginRight: 24,
                width: 360

            },

            container: {
                border: 'solid 1px #d9d9d9',
                borderBottom: 'none',
                minHeight: this.props.height,
                overflow: 'hidden'
            },

            bottomTear: {
                display: 'block',
                position: 'relative',
                marginTop: -10,
                width: 360
            }
        };

        return (
            <div style={styles.root}>
                <div style={styles.container}>
                    {this.props.children}
                </div>
                <img style={styles.bottomTear} src="images/bottom-tear.svg" />
            </div>
        );
    }
}