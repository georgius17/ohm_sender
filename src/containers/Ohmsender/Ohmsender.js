import React, {Component} from 'react';
import Contacts from '../../components/Contacts/Contacts'
import Messages from '../../components/Messages/Messages';
import Aux from '../../UI/Aux/Aux';
import { firebaseAuth } from '../../services/firebase';
//import { connect } from 'react-redux';
//import classes from './Ohmsender.module.css'

class Ohmsender extends Component {
    


    render(){
        return (
            <Aux>
                <Contacts />
                <Messages />
            </Aux>
        )
    }
} 




export default Ohmsender;