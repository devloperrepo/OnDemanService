import React from 'react';
import { Redirect } from 'react-router-dom';
import AboutContent from '../../components/About/AboutContent';
import AppLinks from '../../components/About/AppLinks';
import { compose } from 'redux';
// import { withTheme } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import TopCategories from '../../components/Category/TopCategories';
import HomeCaroselParallax from '../../components/Parallax/HomeCaroselParallax';
import ServicePopup from '../../components/Providers/ServicePopup';
import FindYourService from '../../components/Providers/FindYourService';
import BusinessDirector from '../../components/Providers/BusinessDirector';

class Components extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoginPopupVisible: false,
            isSignupPopupVisible: false,
            searchedData: [],
            searchRedirect: false,
            category: 0,
            city: '',
            serviceId: '',
            servicePopup: false
        };
        let theme = this.context;
        console.log({ theme });
    }
    componentDidMount() {
        this.props.allCategoryAction();
    }

    searchReceived = (data, city, category, serviceId) => {
        this.setState({
            searchedData: data,
            searchRedirect: true,
            city: city,
            category: category,
            serviceId: serviceId
        });
    };

    providerSelected = provider => {
        this.setState({ providerData: provider, servicePopup: true });
    };
    closeServicePopup = () => {
        this.setState({ servicePopup: false });
    };
    render() {
        const { classes, settings } = this.props;

        if (this.state.searchRedirect) {
            if (this.state.city == '' && this.state.category == 0) {
                return (
                    <Redirect
                        to={{
                            pathname: `/provider/list/`,
                            state: {
                                city: this.state.city,
                                category: this.state.category,
                                providerData: this.state.searchedData
                            }
                        }}
                    />
                );
            } else if (this.state.city == '' && this.state.category != 0) {
                return (
                    <Redirect
                        to={{
                            pathname: `/provider/category/${this.state.category}`,
                            state: {
                                city: this.state.city,
                                category: this.state.category,
                                providerData: this.state.searchedData
                            }
                        }}
                    />
                );
            } else if (this.state.city != '' && this.state.category == 0) {
                return (
                    <Redirect
                        to={{
                            pathname: `/provider/list/${this.state.city}`,
                            state: {
                                city: this.state.city,
                                category: this.state.category,
                                providerData: this.state.searchedData
                            }
                        }}
                    />
                );
            } else {
                return (
                    <Redirect
                        to={{
                            pathname: `/provider/list/${this.state.city}/${this.state.category}`,
                            state: {
                                city: this.state.city,
                                category: this.state.category,
                                providerData: this.state.searchedData
                            }
                        }}
                    />
                );
            }
        }
        return (
            <div>
                <HomeCaroselParallax
                    categoryData={this.props.categoryData}
                    banners={settings.banners}
                    settings={settings}
                />
                <div>
                    <div>
                        <TopCategories categoryData={this.props.categoryData} />
                        <FindYourService />
                        {/* <ExploreCityListings /> */}
                        <BusinessDirector />
                    </div>
                    <AboutContent banners={settings.banners} />
                    <AppLinks settings={this.props.settings} />
                </div>
                {this.state.servicePopup && (
                    <ServicePopup
                        provider={this.state.providerData}
                        open={this.state.servicePopup}
                        close={this.closeServicePopup}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = ({ settings, categories, providers }) => {
    return {
        settings,
        categoryData: categories.categoryData,
        featuredProviderList: providers.featuredProviderList,
        featuredProviderLoader: providers.featuredProviderLoader
    };
};
const composedHOC = compose(connect(mapStateToProps, actions));
export default composedHOC(Components);
