import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import Routes from './Routes';
import RouteNavItem from './components/RouteNavItem';
import { CognitoUserPool, } from 'amazon-cognito-identity-js';
import config from './config.js';
import AWS from 'aws-sdk';
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userToken: null,
            isLoadingUserToken: true,
        };
    };

    async componentDidMount() {
        const currentUser = this.getCurrentUser();
        if (currentUser === null) {
            this.setState({isLoadingUserToken: false});
            return;
        }
        try {
            const userToken = await this.getUserToken(currentUser);
            this.updateUserToken(userToken);
        }
        catch(e) {
            alert(e);
        }
        this.setState({isLoadingUserToken: false});
    };

    getCurrentUser() {
        const userPool = new CognitoUserPool({
            UserPoolId: config.cognito.USER_POOL_ID,
            ClientId: config.cognito.APP_CLIENT_ID
        });
        return userPool.getCurrentUser();
    };

    getUserToken(currentUser) {
        return new Promise((resolve, reject) => {
            currentUser.getSession(function(err, session) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(session.getIdToken().getJwtToken());
            });
        });
    };

    updateUserToken = (userToken) => {
        this.setState({
            userToken: userToken,
        });
    };

    handleNavLink = (event) => {
        event.preventDefault();
        this.props.history.push(event.currentTarget.getAttribute('href'));
    };

    handleLogout = (event) => {
        const currentUser = this.getCurrentUser();
        if (currentUser !== null) {
            currentUser.signOut();
        }
        if (AWS.config.credentials) {
            AWS.config.credentials.clearCachedId();
        }
        this.updateUserToken(null);
        this.props.history.push(config.routes.LOGIN);
    };

    render() {
        const childProps = {
            userToken: this.state.userToken,
            updateUserToken: this.updateUserToken,
        };

        return ! this.state.isLoadingUserToken && (
            <div className="App container">
                <Navbar fluid collapseOnSelect fixedTop>
                    <Navbar.Header>
                        <Navbar.Brand>
                                <a href="/">
                                <img src={process.env.PUBLIC_URL + 'apple-touch-icon.png'} alt="Hannah's Baking Experiments"/>
                                <p>Hannah's Baking Experiments</p></a>
                        </Navbar.Brand>
                        <Navbar.Toggle/>
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            { this.state.userToken
                                ? <NavItem onClick={this.handleLogout}>
                                    <span className="glyphicon glyphicon-log-out"/>Logout
                                  </NavItem>
                                : <RouteNavItem onClick={this.handleNavLink} href={config.routes.LOGIN}>
                                    <span className="glyphicon glyphicon-log-in"/>Login
                                  </RouteNavItem>
                            }
                        </Nav>
                        <Nav pullRight>
                            <RouteNavItem onClick={this.handleNavLink} href={config.routes.INGREDIENTS}>
                                <span className="glyphicon glyphicon-cutlery" />Ingredients
                            </RouteNavItem>
                        </Nav>
                        <Nav pullRight>
                            <RouteNavItem onClick={this.handleNavLink} href={config.routes.RECIPES}>
                                <span className="glyphicon glyphicon-list" />Recipes
                            </RouteNavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Routes childProps={childProps}/>
            </div>
        );
    };
}

export default withRouter(App);