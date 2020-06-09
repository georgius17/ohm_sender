import React from 'react';
import classes from './Contact.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBahai } from '@fortawesome/free-solid-svg-icons';


const contact = (props) => {
    let icon = null;
    let deleteBut = null;
    if (props.attention){
        icon = <FontAwesomeIcon className={classes.Icon} icon={faBahai} />
    }
    if (props.showDeletebut){
        deleteBut= <button className={classes.DeleteBut} onClick={props.deleteButClicked} >X </button>
    }
    return (
        
        <div className={[classes.Contact, classes[props.type]].join(' ')} >
            <h3 onClick={props.clicked}> {props.name} </h3>
            {deleteBut}
            {icon}
        </div>
    )
}

export default contact;