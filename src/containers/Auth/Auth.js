import React, { Component } from "react";
import Input from '../../UI/Input/Input';
import { Redirect } from 'react-router-dom';
import classes from './Auth.module.css';
import Button from '../../UI/Button/Button';
//import CSSTransition from "react-transition-group/CSSTransition";
//import Loader from '../../UI/Loader/Loader';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

class Auth extends Component {

    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder:'Mail adress'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder:'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        signIn: false,
        formIsValid: false
    }

     baseState = this.state


    inputChangeHandler = (event, inputID) => {
        const updatedForm = {
            ...this.state.controls
        };
        const updatedElement = {
            ...updatedForm[inputID]
        };
        updatedElement.value = event.target.value;
        updatedElement.touched= true;
        updatedElement.valid = this.checkValidity(updatedElement.value, updatedElement.validation);
        updatedForm[inputID] = updatedElement;

        let formIsValid = true;

        for (let inputId in updatedForm){
            formIsValid = updatedForm[inputId].valid && formIsValid
        }

        this.setState({controls: updatedForm, formIsValid: formIsValid});
    }

    checkValidity(value, rules) {
        let isValid = false;

        if (rules.required) {
            isValid = value.trim() !== '';
        }
        if (rules.minLength){
            isValid = value.length >= rules.minLength && isValid
        }
        if (rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid
        }

        return isValid;
    }

    switchAuthHandler = () => {
        this.setState(prevState => {
            return {signIn: !prevState.signIn}
        })
    } 

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.signIn)
    }

    render(){

        let formArray = []
        for (let key in this.state.controls){
            formArray.push({
                id: key,
                config: this.state.controls[key]
            })
        }

        let authMetod = !this.state.signIn ? <h3>Register</h3> : <h3>Sign In</h3>

        let form = (
            <form onSubmit={this.submitHandler} >
                {formArray.map(element => (
                    <Input
                        key={element.id}
                        elementType={element.config.elementType}
                        elementConfig={element.config.elementConfig}
                        value={element.config.value}
                        validation={element.config.validation}
                        invalid={!element.config.valid}
                        touched={element.config.touched}
                        changed={(event)=> this.inputChangeHandler(event, element.id)}
                    />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>Submit</Button>
                <input className={classes.Reset} type="reset" value="Cancel"></input>
            </form>
        )

        let authRedirect = null;
        if (this.props.authenticated){
            authRedirect = <Redirect to="/messages"/>
        }

        return (
            <div className={classes.FormData}>
                {authRedirect}
                <Button clicked={this.switchAuthHandler} btnType="Success" >Sign in / Register</Button>
                {authMetod}
                {form}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        //isAuthenticated: state.auth.token !== null
        authenticated: state.token
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, signIn)=> dispatch(actions.auth(email, password, signIn))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);

