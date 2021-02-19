import React, { Component } from 'react';
import { withTheme } from '@material-ui/core/styles';
class NotFound extends Component {
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

                <div className="text-center" style={{ minHeight: '400px' }}>
                    <div className="text-center">
                        <h1>404</h1>
                        <br />
                        <h4>Page you're looking for does not exists.</h4>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTheme()(NotFound);
