import React from 'react';
import classes from './Message.module.css';

const message = (props) => {
    let msgClass = [classes.Message]
    if (props.receiver){
        msgClass.push(classes.Receiver)
    } else {
        msgClass.push(classes.Sender)
    }
    
    return (
        <div className={msgClass.join(' ')} >
            {props.value} 
        </div>
    )
}

export default message;