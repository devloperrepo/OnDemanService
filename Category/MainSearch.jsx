import React from 'react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import navbarsStyle from 'assets/jss/material-kit-react/views/componentsSections/navbarsStyle.jsx';
import {
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    MenuItem
} from '@material-ui/core';
import { Link, Redirect } from 'react-router-dom';
import CustomDropdown from 'components/CustomDropdown/CustomDropdown.jsx';
import { Apps, CloudDownload } from '@material-ui/icons';
import * as actions from '../../actions';
import { compose } from 'redux';
import { connect } from 'react-redux';
class MainSearch extends React.Component {
    constructor() {
        super();
        this.state = {
            title: '',
            keyword: '',
            type: 1,
            data: []
        };
    }
    handleSearchClick = () => {
        this.props.mainSearchAction(
            { keyword: this.state.keyword, type: this.state.type },
            this.onDone
        );
    };

    onDone = (success, data) => {
        if (success) {
            this.setState({ redirect: true, data: data });
        }
    };
    render() {
        const { classes } = this.props;

        return <div className={classes.container}>Hello</div>;
    }
}

const composedComponent = compose(
    withStyles(navbarsStyle),
    connect(
        null,
        actions
    )
);

export default composedComponent(MainSearch);
