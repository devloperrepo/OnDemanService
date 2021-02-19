import React from 'react';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch } from 'react-router-dom';
import indexRoutes from '../routes/index.jsx';
import MainPageLinks from '../components/Header/MainPageLinks';
import MainLeftLinks from '../components/Header/MainLeftLinks';
import { compose } from 'redux';
import componentsStyle from 'assets/jss/material-kit-react/views/components.jsx';
import withStyles from '@material-ui/core/styles/withStyles';
import logo from 'assets/img/logo1.jpg';
import Header from '../components/Header/Header.jsx';
import Footer from 'components/Footer/Footer.jsx';
import 'assets/scss/material-kit-react.css?v=1.3.0';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import withCustomTheme from '../components/HOC/HOCwithCustomTheme.jsx';
import LoginForm from './LoginPage/LoginForm.jsx';
import 'react-notifications/lib/notifications.css';
import {
    NotificationContainer,
    NotificationManager
} from 'react-notifications';
import withUser from '../components/HOC/HOCwithUser.jsx';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Verification from '../components/Providers/Verification.jsx';
import ForgotPassword from './LoginPage/ForgotPassword.jsx';
import CustomerVerification from '../components/Customer/CustomerVerification.jsx';
import { addLocaleData, FormattedMessage } from 'react-intl';
import locale_en from 'react-intl/locale-data/en';
import locale_de from 'react-intl/locale-data/de';
import { IntlProvider } from 'react-intl';
import messages_de from '../utils/translations/de.json';
import messages_en from '../utils/translations/en.json';
import NotFound from './NotFound.jsx';
import ScrollToTop from '../components/HOC/ScrollToTop.jsx';
import HOCLoader from '../components/HOC/HOCLoader.jsx';
import { GOOGLE_MAP_KEY } from '../utils/config/constants.js';
import axios from 'axios';
import { store } from '../store/index';
import { cookies } from '../utils/getToken';
const messages = {
    de: messages_de,
    en: messages_en
};

addLocaleData([...locale_en, ...locale_de]);

var hist = createBrowserHistory();

let isMounted = false;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoginPopupVisible: false,
            isSignupPopupVisible: false,
            renderDashPage: false,
            signupRedirect: false,
            showProviderVerification: false,
            showCustomerVerification: false,
            showForgotPopup: false,
            usedEmail: '',
            language: props.currentLanguage ? props.currentLanguage : 'en',
            redirectPage: false,
            slug: '',
            latitude: '',
            longitude: '',
            pincode: ''
        };
    }
    showPosition = async position => {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        const { data } = await axios({
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/geocode/json?key=${GOOGLE_MAP_KEY}&latlng=${latitude},${longitude}&sensor=true`
        });
        if (data.status === 'OK') {
            if (data.results[0].formatted_address) {
                this.setState({
                    address_line1: data.results[0].formatted_address
                });
            }
            data.results[0].address_components.map(address => {
                if (address.types.includes('postal_code')) {
                    this.setState({
                        pincode: address.long_name,
                        latitude: latitude,
                        longitude: longitude
                    });
                }
            });
        } else {
            NotificationManager.error(
                <FormattedMessage
                    id="googleApiNotWorking"
                    defaultMessage="Google Api not working, Please add address manually"
                />,
                'Error'
            );
        }
    };

    componentDidMount() {
        isMounted = true;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                console.log({ position });

                this.setPlace(
                    position.coords.latitude,
                    position.coords.longitude
                );
            });
        } else {
            error => console.log(error);
        }
        this.getData();
    }
    setPlace(lat, lng) {
        cookies.set('latitude', lat, { path: '/' });
        cookies.set('longitude', lng, { path: '/' });
    }
    getData() {
        if (isMounted) {
            this.props.checkMaintainence();
            this.props.getHeaderLinksAction();
            this.props.bannerListAction();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.currentLanguage != this.props.currentLanguage) {
            if (isMounted) {
                this.setState({ language: this.props.currentLanguage });
            }
        }
        if (prevState.latitude != this.state.latitude) {
            this.props.saveCurrentLocationAction({
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                pincode: this.state.pincode
            });
        }
    }
    componentWillUnmount() {
        isMounted = false;
    }

    renderLogin = () => {
        this.props.showLoginPopup();
    };

    renderProviderVerification = email => {
        this.setState({ showProviderVerification: true, usedEmail: email });
    };
    renderCustomerVerification = email => {
        this.setState({ showCustomerVerification: true, usedEmail: email });
    };
    renderForgotPassword = email => {
        this.setState({ showForgotPopup: true, usedEmail: email });
    };

    closeLoginPopup = () => {
        this.props.hideLoginPopup();
    };

    handleVerifyClose = () => {
        this.setState({ showProviderVerification: false });
    };
    handleCustomClose = () => {
        this.setState({ showCustomerVerification: false });
    };
    handleForgotClose = () => {
        this.setState({ showForgotPopup: false });
    };
    handleLanguageChange = lang => {
        document.documentElement.lang = lang;
        this.props.changeLanguageAction({ language: lang });
    };

    renderheader = () => {
        return (
            this.props.cmsLinks && (
                <Header
                    brandImg={logo}
                    rightLinks={
                        <MainPageLinks
                            renderLogin={this.renderLogin}
                            renderSignup={this.renderSignup}
                            renderDashboard={this.renderDashboard}
                            changeLanguage={this.handleLanguageChange}
                        />
                    }
                    leftLinks={
                        this.props.cmsLinks && (
                            <MainLeftLinks cmsLinks={this.props.cmsLinks} />
                        )
                    }
                    fixed
                    color="transparent"
                    changeColorOnScroll={{
                        height: 100,
                        color: 'primary'
                    }}
                />
            )
        );
    };
    renderFooter = () => {
        return (
            <div>
                <Footer />
            </div>
        );
    };
    render() {
        const { language } = this.state;
        const { settingsLoader, settings } = this.props;
        if (this.state.maintainence) {
            this.props.history.push(`/maintainence`);
        }
        return (
            <HOCLoader loading={settingsLoader}>
                <div>
                    <IntlProvider
                        locale={language}
                        messages={messages[language]}
                    >
                        <Router history={hist}>
                            <ScrollToTop>
                                <MuiThemeProvider
                                    theme={createMuiTheme({
                                        palette: {
                                            primary: {
                                                main:
                                                    settings.colors.SECONDARY
                                                        .HEX
                                            },
                                            secondary: {
                                                main:
                                                    settings.colors.PRIMARY.HEX,
                                                text: '#ffffff'
                                            }
                                        },
                                        typography: { useNextVariants: true }
                                    })}
                                >
                                    {!this.props.removeHeader &&
                                        this.renderheader()}
                                    <Switch>
                                        {indexRoutes.map((prop, key) => {
                                            return (
                                                <Route
                                                    exact={
                                                        prop.exact
                                                            ? prop.exact
                                                            : false
                                                    }
                                                    path={prop.path}
                                                    key={key}
                                                    component={prop.component}
                                                />
                                            );
                                        })}
                                        <Route component={NotFound} />
                                    </Switch>
                                    <NotificationContainer />
                                    {!this.props.removeHeader &&
                                        this.renderFooter()}
                                    {store.getState().auth.isLoginVisible && (
                                        <LoginForm
                                            renderSamePage={false}
                                            isVisible={
                                                store.getState().auth
                                                    .isLoginVisible
                                            }
                                            closeLoginPopup={
                                                this.closeLoginPopup
                                            }
                                            renderProviderVerification={
                                                this.renderProviderVerification
                                            }
                                            renderCustomerVerification={
                                                this.renderCustomerVerification
                                            }
                                            renderForgotPassword={
                                                this.renderForgotPassword
                                            }
                                        />
                                    )}
                                    <CustomerVerification
                                        email={this.state.usedEmail}
                                        open={
                                            this.state.showCustomerVerification
                                        }
                                        closePopup={this.handleCustomClose}
                                    />
                                    <Verification
                                        email={this.state.usedEmail}
                                        open={
                                            this.state.showProviderVerification
                                        }
                                        close={this.handleVerifyClose}
                                    />
                                    <ForgotPassword
                                        email={this.state.usedEmail}
                                        open={this.state.showForgotPopup}
                                        close={this.handleForgotClose}
                                    />
                                </MuiThemeProvider>
                            </ScrollToTop>
                        </Router>
                    </IntlProvider>
                </div>
            </HOCLoader>
        );
    }
}

const mapStateToProps = ({ auth, settings }) => {
    return {
        userData: auth.userData,
        isLoginVisible: auth.isLoginVisible,
        removeHeader: auth.removeHeader,
        currentLanguage: settings.currentLanguage,
        cmsLinks: settings.cmsLinks,
        maintainence: settings.maintainence,
        settingsLoader: settings.settingsLoader
    };
};
const composedWithUser = compose(
    withStyles(componentsStyle),
    connect(mapStateToProps, actions)
);

export default composedWithUser(withUser(withCustomTheme(App)));
