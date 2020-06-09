import * as actionTypes from './actionTypes';
//import axios from 'axios';
import { firebaseAuth, db } from "../../services/firebase";

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        userId: userId
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};


export const auth = (email, password, signIn) => {
    return dispatch => {
        dispatch(authStart())
        
        if (signIn){
            firebaseAuth().signInWithEmailAndPassword(email, password)
            .then(res => {
                console.log('Success log in')
                //dispatch(authSuccess('random number', firebaseAuth().currentUser.uid))

            })
            .catch(err => {
                console.log('failed to log in')
                //dispatch(authFail('failed'))
            })  
        }
        else {
            
            firebaseAuth().createUserWithEmailAndPassword(email, password)
            
            .then(res => {
                let userId = firebaseAuth().currentUser.uid
                console.log(userId)
                dispatch (db.ref('users/'+userId).set({
                    messages: null,
                    uid: userId,
                    email: email
                }),
                db.ref('registeredUsers/'+userId).set({
                    uid: userId,
                    email: email
                }))
                
            })
            
            .catch(err => {
                console.log('failed sign up')
            })
        }
        
    }
}












