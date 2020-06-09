import React, {Component} from 'react';
import Layout from './containers/Layout/Layout';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import Auth from './containers/Auth/Auth';
import Ohmsender from './containers/Ohmsender/Ohmsender';
import { firebaseAuth } from './services/firebase';
import * as actions from './store/actions/index';
import './App.css';

class App extends Component {

  state = {
    auth: false,
    loading: false
  }

  componentDidMount(){
    firebaseAuth().onAuthStateChanged(user => {
      if (user){
        this.setState({
          auth: true,
          loading: false
        });
        //this.props.onAuthSuccess('random number', user.uid)
        console.log(user.email)

      } else {
        this.setState({
          auth: false,
          loading: false
        });
      }
    })
  }

  // componentDidUpdate(){
  //   console.log('did update')
  //   console.log(this.state.auth)
  // }

  render(){

    let routes = (
      <Switch>
          <Route path="/" exact component={Auth} />
          <Redirect to="/" />
      </Switch>
    )

    if (this.state.auth){
      routes = (
        <Switch>
            <Route path="/" exact component={Ohmsender} />
            <Redirect to="/" />
        </Switch>
      )
    }
   
    return (
      <Layout>
        {routes}
      </Layout>
    )
  }
} 

const mapDispatchToProps = dispatch => {
  return {
    onAuthSuccess: (token, userId)=> dispatch(actions.authSuccess(token, userId))
  }
}

export default withRouter(connect(null, mapDispatchToProps)(App));

