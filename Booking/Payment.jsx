import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withTheme } from '@material-ui/core/styles';
import SimpleMenuParallax from '../../components/Parallax/SimpleMenuParallax';
import { Paper, Button, CircularProgress } from '@material-ui/core';
import Card from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import {
    formatCreditCardNumber,
    formatExpirationDate,
    formatCVC,
    PAYMENT_PENDING
} from '../../utils/config/constants';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import { compose } from 'redux';
import HOCSectionLoader from '../../components/HOC/HOCSectionLoader';
import { NotificationManager } from 'react-notifications';
import { FormattedMessage, injectIntl } from 'react-intl';
import { validateCreditCardForm } from '../../utils/validators/validateForm';
import DeleteAlert from '../../components/Alert/DeleteAlert';
import AddNewCard from '../../components/Booking/AddNewCard';
import SavedCards from '../../components/Booking/SavedCards';
import withCustomTheme from '../../components/HOC/HOCwithCustomTheme.jsx';
class Payment extends Component {
    constructor(props) {
        super();
        this.state = {
            number: '',
            name: '',
            expiry: '',
            cvc: '',
            issuer: '',
            focused: '',
            formData: null,
            bookingId: props.match.params.bookingId,
            booking: '',
            redirectBookingSuccess: false,
            loaderButton: false,
            deleteAlert: false,
            cardSelected: '',
            acceptLoadingButton: false,
            isPayClick: ''
        };
    }

    componentDidMount() {
        this.getData();
        // this.props.cardListAction();
    }
    getData() {
        this.props.bookingDetailAction(
            {
                bookingId: this.state.bookingId
            },
            this.onDone
        );
    }
    onDone = (success, data) => {
        if (success) {
            this.setState({ booking: data.data });
        } else {
            NotificationManager.error(data.message, 'Error');
        }
    };
    renderButton = () => {
        if (this.state.loaderButton) {
            return <CircularProgress />;
        } else {
            return (
                <button
                    className="btn btn-primary btn-block"
                    onClick={this.addNewCard}
                >
                    <FormattedMessage id="payment.add" defaultMessage="Add" />
                </button>
            );
        }
    };
    addNewCard = () => {
        if (
            validateCreditCardForm(
                {
                    number: this.state.number,
                    name: this.state.name,
                    expiry: this.state.expiry,
                    cvc: this.state.cvc
                },
                this.handleError
            )
        ) {
            this.setState({ loaderButton: true });
            this.props.cardAddAction(
                {
                    number: this.state.number,
                    name: this.state.name,
                    expiry: this.state.expiry,
                    cvc: this.state.cvc
                },
                this.onDoneAdding
            );
        } else {
            NotificationManager.error(
                <FormattedMessage
                    id="addCorrectDetails"
                    defaultMessage="Please add correct details in payment form"
                />,
                'Error'
            );
        }
    };
    redirectList = () => {
        this.getData();
    };

    handleError = params => {
        this.setState(params);
    };

    onDoneAdding = (success, data) => {
        this.setState({ loaderButton: false });
        if (success) {
            NotificationManager.success(
                <FormattedMessage
                    id="cardAddedSuccess"
                    defaultMessage="Card added successfully"
                />,
                'Success'
            );
        } else {
            NotificationManager.error(data.message, 'Error');
        }
    };

    handleCallback = ({ issuer }, isValid) => {
        if (isValid) {
            this.setState({ issuer });
        }
    };

    handleInputFocus = ({ target }) => {
        this.setState({
            focused: target.name
        });
    };

    handleInputChange = ({ target }) => {
        if (target.name === 'number') {
            target.value = formatCreditCardNumber(target.value);
        } else if (target.name === 'expiry') {
            target.value = formatExpirationDate(target.value);
        } else if (target.name === 'cvc') {
            target.value = formatCVC(target.value);
        }
        this.setState({ [target.name]: target.value });
    };

    handleSubmit = e => {
        e.preventDefault();
        const { issuer } = this.state;
        const formData = [...e.target.elements]
            .filter(d => d.name)
            .reduce((acc, d) => {
                acc[d.name] = d.value;
                return acc;
            }, {});

        this.setState({ formData });
        this.form.reset();
    };
    payViaCard = cardId => {
        this.setState({ isPayClick: cardId });
        if (this.state.booking.payment_status === PAYMENT_PENDING) {
            this.setState({ acceptLoadingButton: true });
            this.props.payViaCardAction(
                {
                    cardId: cardId,
                    bookingToken: this.state.booking.token
                },
                this.onPaymentDone
            );
        } else {
            this.setState({ isPayClick: '' });
            NotificationManager.error(
                <FormattedMessage
                    id="paymentAlreadyDone"
                    defaultMessage="Payment is already done"
                />,
                'Error'
            );
        }
    };
    onPaymentDone = (success, data) => {
        this.setState({ isPayClick: '' });
        if (success) {
            NotificationManager.success(data.message, 'Success');
            this.setState({ redirectBookingSuccess: true });
        }
    };

    alertDeleteCard = cardId => {
        this.setState({ deleteAlert: true, cardSelected: cardId });
    };

    handleYes = () => {
        this.setState({ deleteAlert: false });
        this.deleteCard(this.state.cardSelected);
    };
    handleNo = () => {
        this.setState({ deleteAlert: false });
    };

    deleteCard = cardId => {
        this.props.deleteCardAction(
            {
                cardToken: cardId
            },
            this.onDeleteDone
        );
    };
    onDeleteDone = (success, data) => {
        if (success) {
            NotificationManager.success(data.message, 'Success');
        }
    };

    render() {
        const { formatMessage } = this.props.intl;
        if (this.state.redirectBookingSuccess) {
            return (
                <Redirect
                    to={{
                        pathname: `/user/booking/detail/${this.state.booking.key}`,
                        bookingId: this.state.booking.key
                    }}
                />
            );
        }
        return (
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
                            <HOCSectionLoader loading={this.state.loaderButton}>
                                <h3>
                                    <FormattedMessage
                                        id="service.pay"
                                        defaultMessage="Pay"
                                    />{' '}
                                    {this.props.settings.constants
                                        .CURRENCY_SYMBOL +
                                        this.state.booking.total_amount}{' '}
                                    <FormattedMessage
                                        id="service.viacreditcard"
                                        defaultMessage="via Credit Card"
                                    />
                                    :
                                </h3>

                                <SavedCards
                                    payViaCard={cardId =>
                                        this.payViaCard(cardId)
                                    }
                                    isButtonLoading={this.state.isPayClick}
                                />
                                <AddNewCard
                                    redirectToList={this.redirectList}
                                />
                            </HOCSectionLoader>

                            <DeleteAlert
                                open={this.state.deleteAlert}
                                close={this.closeDeleteAlert}
                                handleNo={this.handleNo}
                                handleYes={this.handleYes}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const composedComponent = compose(withTheme(), connect(null, actions));
export default composedComponent(withCustomTheme(injectIntl(Payment)));
