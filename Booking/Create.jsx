import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Radio, Button } from '@material-ui/core';
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import componentsStyle from 'assets/jss/material-kit-react/views/components.jsx';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import moment from 'moment';
import { withTheme } from '@material-ui/core/styles';
import { getOffSetTime } from '../../utils/config/constants.js';
import AddressPanel from '../../components/Booking/AddressPanel.jsx';
import { TextField } from '@material-ui/core';
import DateTimePanel from '../../components/Booking/DateTimePanel';
import ConfirmedData from '../../components/Booking/ConfirmedData.jsx';
import PromocodePanel from '../../components/Booking/PromocodePanel.jsx';
import BookingTimeSlotPopup from '../../components/Booking/BookingTimeSlotPopup.jsx';
import AddPromoPopup from '../../components/Booking/AddPromoPopup.jsx';
import { NotificationManager } from 'react-notifications';
import AddAddressPopup from '../../components/Booking/AddAddressPopup';
import { FormattedMessage, injectIntl } from 'react-intl';
import AddWalletMoney from '../../components/Customer/AddWalletMoney';
import withUser from '../../components/HOC/HOCwithUser.jsx';
import withCustomTheme from '../../components/HOC/HOCwithCustomTheme.jsx';

class Create extends Component {
    constructor(props) {
        super();
        const commonStates = {
            businessHoursOpen: false,
            bookingPopup: false,
            loginPopup: false,
            bookingData: [],
            dateTimeValue: '',
            slots: [],
            haveSlots: false,
            addCoupon: false,
            timeSlot: '',
            bookingTimeSlot: '',
            addAddress: false,
            isPromoApplied: false,
            promocode: '',
            notes: '',
            finalAmount: '',
            paymentType: 1,
            displayAddress:
                props.userData.addresses.length > 0
                    ? props.userData.addresses.filter(
                          address => address.is_default === 1
                      )[0]
                    : '',
            packageItem: null,
            showFundOption: false,
            showAddWalletOption: false,
            showAddPopup: false,
            openDateTime: false
        };

        if (props.match.params) {
            this.state = {
                providerId: props.match.params.providerId,
                serviceId: props.match.params.serviceId,
                loader: true,
                itemId: props.match.params.itemId,
                ...commonStates
            };
        } else {
            this.state = {
                providerId: '',
                serviceId: '',
                loader: true,
                itemId: '',
                ...commonStates
            };
        }
    }
    componentDidUpdate(prevProps) {
        if (
            prevProps.userData.addresses.length !==
            this.props.userData.addresses.length
        ) {
            this.setState({
                displayAddress: this.props.userData.addresses.filter(
                    address => address.is_default === 1
                )[0],
                packageItem: this.state.bookingData.packages
                    ? this.state.bookingData.packages.filter(
                          pack => pack.key === this.state.itemId
                      )[0]
                    : []
            });
        }
    }
    componentDidMount() {
        this.getData();
        this.props.promoCodeListAction();
    }

    getData = () => {
        this.props.providerDetailAction(
            {
                providerId: this.state.providerId,
                serviceId: this.state.serviceId,
                day: new Date().getDay()
            },
            this.onDone
        );
    };
    onDone = (success, data) => {
        if (success) {
            this.setState({
                bookingData: data,
                loader: false,
                packageItem: data.packages.filter(
                    pack => pack.key === this.state.itemId
                )[0]
            });
        } else {
            this.setState({ loader: false, error: data });
        }
    };

    onChangeDate = event => {
        const dateTimeValue = moment(event).format('Y-MM-DD');
        this.setState({ openDateTime: true, dateTimeValue: dateTimeValue });
        this.getSlots(dateTimeValue);
    };

    getSlots = chosenDate => {
        this.props.bookingTimeSlotAction(
            {
                providerId: this.state.providerId,
                day: new Date(chosenDate).getDay(),
                date: chosenDate,
                offset: new Date().getTimezoneOffset(),
                currentDate: new Date()
            },
            this.onDateTimeSelected
        );
    };
    onDateTimeSelected = (success, data) => {
        if (success) {
            this.setState({
                slots: data.data.slots,
                haveSlots: true,
                openDateTime: false
            });
        } else {
            NotificationManager.error(
                <FormattedMessage
                    id="noSlotsAvailable"
                    defaultMessage="Sorry No Slots Available"
                />,
                'Error'
            );
        }
    };
    closeTimeSlotPopup = () => {
        this.setState({ haveSlots: false });
    };
    closeCouponPopup = () => {
        this.setState({ addCoupon: false });
    };

    closeAddressPopup = () => {
        this.setState({ addAddress: false });
    };

    renderPromoPopup = () => {
        this.setState({ addCoupon: true });
    };
    addNewAddress = () => {
        this.setState({ addAddress: true });
    };

    appliedPromo = (code, discountedAmount) => {
        this.setState({
            isPromoApplied: true,
            promocode: code,
            finalAmount: discountedAmount
        });
    };
    setAddress = address => {
        this.setState({ displayAddress: address });
    };
    setTimeSlot = slot => {
        const timeValue = getOffSetTime(slot.start);
        this.setState({ timeSlot: timeValue, bookingTimeSlot: slot });
    };
    handlePaymentOption = event => {
        this.setState({ paymentType: event.target.value });
    };

    showAddFundOption = () => {
        this.setState({ showFundOption: true });
    };

    showWalletPopup = () => {
        this.setState({ showAddWalletOption: true });
    };
    closeWalletPopup = () => {
        this.setState({ showAddWalletOption: false });
    };
    closeAddAmountPopup = () => {
        this.setState({ showAddPopup: false });
    };
    renderAddPopup = () => {
        this.setState({ showAddPopup: true });
    };
    render() {
        const { bookingData, itemId, packageItem } = this.state;
        const { formatMessage } = this.props.intl;

        var yesterday = moment().subtract(1, 'day');
        var valid = function(current) {
            return current.isAfter(yesterday);
        };
        if (this.state.bookingPopup) {
            return (
                <Redirect
                    to={{
                        pathname: `/service/booking/`
                    }}
                />
            );
        }

        return (
            // <HOCLoader loading={!this.props.data ? true : false}>
            <div>
                <div
                    style={{
                        backgroundColor: this.props.theme.palette.primary.main,
                        height: '80px',
                        width: '100%'
                    }}
                />
                <div className="creat-booking-page">
                    <div className="container">
                        <div className="dir-alp-con dir-alp-con-1">
                            <GridContainer>
                                <GridItem md={7} xs={12} sm={12}>
                                    <div className=" provider-bio">
                                        <h2 className="mb-4">Create Booking</h2>
                                        <div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <DateTimePanel
                                                        open={
                                                            this.state
                                                                .openDateTime
                                                        }
                                                        isValidDate={valid}
                                                        timeFormat={false}
                                                        onChange={
                                                            this.onChangeDate
                                                        }
                                                        value={
                                                            this.state
                                                                .dateTimeValue
                                                        }
                                                    />
                                                </div>
                                                {this.state.bookingTimeSlot && (
                                                    <div className="col-md-6 mb-3">
                                                        <h4 className="mb-2">
                                                            <FormattedMessage
                                                                id="time"
                                                                defaultMessage="Time"
                                                            />
                                                            :
                                                        </h4>
                                                        <Button
                                                            color="primary"
                                                            varian="disabled"
                                                        >
                                                            {
                                                                this.state
                                                                    .bookingTimeSlot
                                                                    .label
                                                            }
                                                        </Button>
                                                    </div>
                                                )}
                                                <AddressPanel
                                                    className="my-4 mt-4"
                                                    addNewAddress={
                                                        this.addNewAddress
                                                    }
                                                    setBookingAddress={address =>
                                                        this.setAddress(address)
                                                    }
                                                />
                                                <PromocodePanel
                                                    className="my-4"
                                                    data={this.props.promoData}
                                                    renderPromoPopup={
                                                        this.renderPromoPopup
                                                    }
                                                    promoCodeApplied={(
                                                        code,
                                                        discountedAmount
                                                    ) =>
                                                        this.appliedPromo(
                                                            code,
                                                            discountedAmount
                                                        )
                                                    }
                                                    packageItem={packageItem}
                                                />

                                                <div className="col-md-12 main-panel cpn-pag-form">
                                                    <div className="form-new">
                                                        <TextField
                                                            id="standard-full-width"
                                                            label={formatMessage(
                                                                {
                                                                    id:
                                                                        'booking.addnotes'
                                                                }
                                                            )}
                                                            name="notes"
                                                            placeholder={formatMessage(
                                                                {
                                                                    id:
                                                                        'booking.noteplaceholder'
                                                                }
                                                            )}
                                                            fullWidth
                                                            className="login-form-textfield"
                                                            margin="normal"
                                                            onChange={event => {
                                                                this.setState({
                                                                    notes:
                                                                        event
                                                                            .target
                                                                            .value
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {this.state.packageItem != null && (
                                                <div className="mt-4">
                                                    <h4>
                                                        <b>
                                                            <FormattedMessage
                                                                id="booking.paymentoptions"
                                                                defaultMessage="Payment Options"
                                                            />
                                                        </b>
                                                    </h4>

                                                    <div className="row">
                                                        {this.props.settings
                                                            .constants
                                                            .paymentOptions &&
                                                            this.props.settings.constants.paymentOptions.map(
                                                                (
                                                                    option,
                                                                    index
                                                                ) => {
                                                                    return (
                                                                        <div
                                                                            className="creat-book-radio"
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            <Radio
                                                                                checked={
                                                                                    option.value ==
                                                                                    this
                                                                                        .state
                                                                                        .paymentType
                                                                                }
                                                                                onChange={
                                                                                    this
                                                                                        .handlePaymentOption
                                                                                }
                                                                                value={`${option.value}`}
                                                                                name="paymentType"
                                                                            />

                                                                            {
                                                                                option.label
                                                                            }
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                    </div>

                                                    {/* {this.state
                                                        .showFundOption && (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={
                                                                this
                                                                    .showWalletPopup
                                                            }
                                                        >
                                                            <FormattedMessage
                                                                id="addFunds"
                                                                defaultMessage="Add Funds"
                                                            />
                                                        </Button>
                                                    )} */}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </GridItem>
                                <GridItem md={5} xs={12} sm={12}>
                                    <div className="provider-bio">
                                        <h2 className="mb-4">
                                            Confirm Booking
                                        </h2>

                                        <ConfirmedData
                                            {...this.props}
                                            data={bookingData}
                                            itemId={itemId}
                                            packageItem={packageItem}
                                            bookingDate={
                                                this.state.dateTimeValue
                                            }
                                            bookingTime={
                                                this.state.bookingTimeSlot
                                            }
                                            selectedAddress={
                                                this.state.displayAddress
                                            }
                                            selectedPromoCode={
                                                this.state.promocode
                                            }
                                            additionalNotes={this.state.notes}
                                            finalAmount={this.state.finalAmount}
                                            paymentType={this.state.paymentType}
                                            showAddFundOption={
                                                this.showAddFundOption
                                            }
                                        />
                                    </div>
                                </GridItem>
                            </GridContainer>
                        </div>
                    </div>
                </div>
                {this.state.haveSlots && (
                    <BookingTimeSlotPopup
                        isVisible={this.state.haveSlots}
                        closePopup={this.closeTimeSlotPopup}
                        slots={this.state.slots}
                        onTimeSlotSelected={this.setTimeSlot}
                    />
                )}

                {this.state.addCoupon && (
                    <AddPromoPopup
                        isVisible={this.state.addCoupon}
                        closePopup={this.closeCouponPopup}
                    />
                )}
                {this.state.addAddress && (
                    <AddAddressPopup
                        settings={this.props.settings}
                        userData={this.props.userData}
                        isVisible={this.state.addAddress}
                        closePopup={this.closeAddressPopup}
                    />
                )}
                {this.state.showAddWalletOption && (
                    <AddWalletMoney
                        open={this.state.showAddWalletOption}
                        close={this.closeWalletPopup}
                        cardList={this.props.cardList}
                        cardLoader={this.props.cardLoader}
                    />
                )}

                {/* {this.state.showAddPopup && (
                    <AddWalletAmountPopup
                        open={this.state.showAddPopup}
                        closeAddAmountPopup={this.closeAddAmountPopup}
                    />
                )} */}
            </div>
            //</HOCLoader>
        );
    }
}
const mapStateToProps = ({ promos, auth, settings }) => {
    return {
        promoData: promos.promoData,
        settings: settings,
        userData: auth.userData
    };
};

const composedComponent = compose(
    withTheme(),
    withStyles(componentsStyle),
    connect(mapStateToProps, actions)
);
export default composedComponent(withCustomTheme(injectIntl(withUser(Create))));
