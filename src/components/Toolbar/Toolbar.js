import React from 'react';
import classes from './Toolbar.module.css';
import logo from '../../assets/logo.png'

const toolbar = () => (
    <header className={classes.header}>
        <div className={classes.logo} >
            <img src={logo} />
        </div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
    <polygon className="svg--sm" fill="white" points="0,0 30,100 65,21 90,100 100,85 100,100 0,100"/>
    <polygon className="svg--lg" fill="white" points="0,0 15,100 33,21 45,70 50,75 85,100 72,20 85,100 100,60 100,80 100,100 0,100" />
    </svg>

    </header>
)

export default toolbar;