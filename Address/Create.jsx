import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Toolbar from '@material-ui/core/Toolbar';
import AddressList from '../../components/Customer/AddressList.jsx';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import CustomerAddressMap from '../../components/Map/CustomerAddressMap.jsx';
import CustomerAddressCreate from '../../components/Customer/CustomerAddressCreate.jsx';
import { FormattedMessage, injectIntl } from 'react-intl';
const styles = theme => ({
    card: {
        color: theme.palette.secondary.main
    }
});
export class AddressCreate extends Component {
    state = {
        address: {
            country: '',
            pincode: ''
        }
    };
    render() {
        const { classes } = this.props;
        return (
            <div className="tz-2-com tz-2-main">
                <h4>
                    <FormattedMessage
                        id="addNewAddress"
                        defaultMessage="Add New Address"
                    />{' '}
                </h4>

                <div className="row">
                    <div className="col-md-12">
                        <CustomerAddressCreate
                            {...this.props}
                            address={this.state.address}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
const composedAddress = compose(withStyles(styles));
export default composedAddress(AddressCreate);
