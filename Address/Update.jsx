import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Toolbar from '@material-ui/core/Toolbar';
import AddressList from '../../components/Customer/AddressList.jsx';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import CustomerAddressMap from '../../components/Map/CustomerAddressMap.jsx';
import CustomerAddressUpdate from '../../components/Customer/CustomerAddressUpdate.jsx';
import { FormattedMessage, injectIntl } from 'react-intl';
const styles = theme => ({
    card: {
        color: theme.palette.secondary.main
    }
});
export class AddressUpdate extends Component {
    render() {
        const { classes, data } = this.props;
        return (
            <div>
                <div className="row mb-4">
                    <div className="col-md-12">
                        <Card className={classes.card}>
                            <Toolbar>
                                <h3>
                                    <FormattedMessage
                                        id="updateAddress"
                                        defaultMessage="Update Address"
                                    />
                                </h3>
                            </Toolbar>
                        </Card>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <CustomerAddressUpdate
                            {...this.props}
                            address={this.props.data}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
const composedAddress = compose(withStyles(styles));
export default composedAddress(AddressUpdate);
