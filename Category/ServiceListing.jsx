import React from 'react';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'redux';
import { withTheme } from '@material-ui/core/styles';
import HOCLoader from '../../components/HOC/HOCLoader.jsx';
import profilePageStyle from 'assets/jss/material-kit-react/views/profilePage.jsx';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import SimpleCategoryListing from '../../components/Category/SimpleCategoryListing';
class ServiceListing extends React.Component {
    constructor() {
        super();
        this.state = {
            loader: false
        };
    }
    componentDidMount() {
        this.getData();
    }
    getData = () => {
        this.props.allCategoryAction();
    };

    onDone = (success, data) => {
        if (success) {
            this.setState({ loader: false, detailData: data });
        } else {
            this.setState({ loader: false, error: data });
        }
    };
    render() {
        const { classes } = this.props;

        return (
            <HOCLoader loading={this.state.loader} errorShow={this.state.error}>
                <SimpleCategoryListing />
            </HOCLoader>
        );
    }
}

const composedComponent = compose(
    withTheme(),
    withStyles(profilePageStyle),
    connect(
        null,
        actions
    )
);
export default composedComponent(ServiceListing);
