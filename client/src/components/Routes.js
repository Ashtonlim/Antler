import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Home from './Home/Home'
import Register from './Register'
import Logout from './Logout'
import Login from './Login'
import Profile from './Profile/Profile'
import Portfolio from './Portfolio/Portfolio'
import Stock from './Stock/Stock'
import Watchlist from './Watchlist/Watchlist'

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/register" component={Register} />
    <Route path="/logout" component={Logout} />
    <Route path="/login" component={Login} />
    <Route path="/profile/:username" component={Profile} />
    <Route path="/portfolio" component={Portfolio} />
    <Route path="/stock/:ticker" component={Stock} />
    <Route path="/watchlist" component={Watchlist} />
  </Switch>
)

export default Routes
