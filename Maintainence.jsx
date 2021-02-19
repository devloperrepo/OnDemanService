import React from 'react';
import { withTheme } from '@material-ui/core/styles';
const Maintainence = () => (
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
                <h1>Maintainence</h1>
                <br />
                <h4>Website is in maintainence mode, try again later</h4>
            </div>
        </div>
    </div>
);

export default withTheme()(Maintainence);
