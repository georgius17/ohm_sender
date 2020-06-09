import React, {Component} from 'react';
import classes from './Contacts.module.css';
import Contact from './Contact/Contact';
import Loader from '../../UI/Loader/Loader';
import { firebaseAuth, db } from "../../services/firebase";
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

class Contacts extends Component {

    state = {
        searchbox: '',
        searching: false,
        loading: false,
        contacts: [],
        savedContacts: [],
        selectedContact: null
    }

    componentDidMount(){
        console.log('CONTACTS DIDMOUNT -> savedContactFinder')
        this.savedContactFinder()
    }

    async savedContactFinder(){
        try {
            let savedContacts = []
            let userId = firebaseAuth().currentUser.uid
            await db.ref("users/"+userId+"/connectedUsers/").on("value", snapshot => {
                snapshot.forEach(user => {
                    savedContacts.push(user.val())
                });
            this.setState({savedContacts: savedContacts})
            savedContacts=[]
            })
            //JESTE NASTAVIT SAVEDCONT. I U DRUHEHO  UZIVATELE
        } catch (error) {
            console.log(error)
        }
    }

    async contactFinder(){
        //event.preventDefault()
        //this.setState({loading: true})
        try {
            await db.ref("registeredUsers").once("value", snapshot => {
                let users = [];
                snapshot.forEach(user => {
                    users.push(user.val());
                });
            this.setState({contacts: users, loading: false})
            })
        } catch (error) {
            console.log(error)
            this.setState({loading: false})
        }

    }

    async signOutHandler(event){
        event.preventDefault()
        try {
            await firebaseAuth().signOut()
        } catch (error) {
            console.log(error)
        }
    }
    

    inputChangeHandler =(event)=>{
        let value = event.target.value;
        let searching = value == '' ? false : true
        this.setState({searchbox: value, searching:searching})
        if (searching){
            this.setState({loading: true})
            this.contactFinder()
        }
        
    }

    selectedContactHandler = (uid, name)=>{
        //this.setState({selectedContact: uid})
        this.props.onSelectedContact(uid, name)
        this.setState({searching: false, searchbox: '', selectedContact: uid})
    }

    async deleteContactHandler (uid){
        try {
            await db.ref("users/"+firebaseAuth().currentUser.uid+"/connectedUsers/"+uid).remove()
            console.log('CONTACT DELETED')
        }
        catch (error){
            console.log(error)
        }
    }

    

    render(){

        let savedContacts = this.state.savedContacts.map(el=>{
            return <Contact
                    key={el.uid}
                    name={el.email}
                    clicked={()=>this.selectedContactHandler(el.uid, el.email)}
                    showDeletebut={true}
                    deleteButClicked={()=>this.deleteContactHandler(el.uid)}
                    attention={el.attention}
                    type={this.state.selectedContact === el.uid ? 'Selected' : 'Unselected'}
                    />
        })
        
        let searchedContacts = null;
        if(this.state.loading){
            searchedContacts = <Loader />
        } else {
        searchedContacts = this.state.contacts.filter(el => {
            let searchValue = el.email.toLowerCase();
            if (firebaseAuth().currentUser.uid === el.uid) return false;
            return searchValue.indexOf(this.state.searchbox.toLowerCase()) !== -1;
        }).map (el=>{
            return <Contact 
                    key={el.uid} 
                    name={el.email} 
                    clicked={()=>this.selectedContactHandler(el.uid, el.email)}
                    showDeletebut={false}
                    attention={false}
                    type={this.state.selectedContact === el.uid ? 'Selected' : 'Unselected'}
                    />
        })
        } 

        let displayedContacts = this.state.searching ? searchedContacts : savedContacts;
        // if(this.state.loading){
        //     searchedContacts = <Loader />
        // }
        let signedUser = firebaseAuth().currentUser.email

        return (
        <div className={classes.Contacts} > 
            <div className={classes.Search}>
                <input 
                    className={classes.SearchInput} 
                    placeholder="Search new contacts" 
                    name="text" 
                    type="text" 
                    value={this.state.searchbox}
                    onChange={this.inputChangeHandler}  />
            </div>
            <div className={classes.ContactsViewed}> {displayedContacts} </div>
            
            <div className={classes.ControlPanel}> 
                <div className={classes.SignedUser}>{signedUser}</div>
                <button className={classes.SignOutButton} onClick={this.signOutHandler} >Sign out</button>
            </div>
        </div>
        )
    }
} 

const mapDispatchToProps = dispatch => {
  return {
      //onNewPlace: (place, code) => dispatch(actions.newPlace(place, code))
      onSelectedContact: (uid, name)=> dispatch(actions.selectedContact(uid, name))
  }
}

export default connect(null, mapDispatchToProps)(Contacts);
//export default Contacts;