import React, { Component } from 'react';
import { withTheme } from '@material-ui/core/styles';
class NotAllowed extends Component {
    render() {
        return (
            <div>
                <div
                    style={{
                        backgroundColor: this.props.theme.palette.primary.main,
                        height: '80px',
                        width: '100%'
                    }}
                />

                <div className="text-center">
                    <div className="text-center">
                        <h1>403</h1>
                        <br />
                        <h4>Sorry you are not allowed to access this page.</h4>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTheme()(NotAllowed);
