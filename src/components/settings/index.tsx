import * as React from 'react';
import {Component} from 'react';
import {Card, CardHeader ,CardText} from 'material-ui/Card';

export class Settings extends Component<any,any>{

    render(){
        return (
            <Card style={{margin: 40}}>
                <CardHeader
                    title='Settings'
                    titleStyle={{fontSize: 20}}
                />
                <CardText>
                    <div>hello</div>
                </CardText>
            </Card>
        )
    }
}