import * as React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

/** Container components */
import DashBoardContainer from '../Containers/DashboardContainer';
import LoginContainer from '../Containers/LoginContainer';
import SignUpContainer from '../Containers/SignUpContainer';
import ConfirmEmailContainer from '../Containers/ConfirmEmailContainer';
import ForgotPasswordContainer from '../Containers/ForgotPasswordContainer';
import PasswordResetContainer from '../Containers/PasswordResetContainer';

/** private route component */
import PrivateRoute from './PrivateRoute';

function AppRouter() {
  return (
    <Router>
      <Switch>
        <PrivateRoute path="/dashboard" component={DashBoardContainer} />
        <Route exact path="/" component={LoginContainer} />
        <Route exact path="/login" component={LoginContainer} />
        <Route exact path="/signup" component={SignUpContainer} />
        <Route exact path="/verify-code" component={ConfirmEmailContainer} />
        <Route
          exact
          path="/reset-password"
          component={PasswordResetContainer}
        />
        <Route
          exact
          path="/forgot-password"
          component={ForgotPasswordContainer}
        />
      </Switch>
    </Router>
  );
}

export default AppRouter;
