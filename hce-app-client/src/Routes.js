import React from 'react';
import { Route, Switch } from 'react-router-dom';
import config from './config';

import AppliedRoute from './components/AppliedRoute';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';
import NotFound from './components/NotFound';
import Home from './containers/Home';
import Login from './containers/Login';
import Signup from './containers/Signup';
import Ingredients from './containers/Ingredients';
import NewIngredient from './containers/NewIngredient';
import Recipes from './containers/Recipes';
import NewRecipe from './containers/NewRecipe';

export default ({ childProps }) => (
    <Switch>
        <AuthenticatedRoute path={config.routes.HOME} exact component={Home} props={childProps} />
        <UnauthenticatedRoute path={config.routes.LOGIN} exact component={Login} props={childProps} />
        <UnauthenticatedRoute path={config.routes.SIGNUP} exact component={Signup} props={childProps} />
        <AuthenticatedRoute path={config.routes.NEW_INGREDIENT} exact component={NewIngredient} props={childProps} />
        <AuthenticatedRoute path={config.routes.INGREDIENTS} exact component={Ingredients} props={childProps} />
        <AuthenticatedRoute path={config.routes.NEW_RECIPE} exact component={NewRecipe} props={childProps} />
        <AuthenticatedRoute path={config.routes.RECIPES} exact component={Recipes} props={childProps} />
        <Route component={NotFound} />
    </Switch>
);