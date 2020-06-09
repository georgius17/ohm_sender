import React, {Component} from 'react';
import classes from './Layout.module.css';
import Aux from '../../UI/Aux/Aux';
import Toolbar from '../../components/Toolbar/Toolbar';

class Layout extends Component {
    render(){
        return(
            <Aux>
                <Toolbar />
                <main className={classes.Content}>
                    
                    {this.props.children}
                </main>
            </Aux>
        )
    }
}

export default Layout