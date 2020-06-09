import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import classes from './Messages.module.css';
import Message from './Message/Message';
import Loader from '../../UI/Loader/Loader';
import { connect } from 'react-redux';
import { firebaseAuth, db } from "../../services/firebase";

class Messages extends Component {

    //messagesEndRef = React.createRef()


    componentDidMount(){
        console.log('MESSAGES DID MOUNT')
        this.databaseChangeHandler()
    }

    componentDidUpdate(prevProps, prevState){
        console.log(this.props.selectedContact)
        if (this.state.targetUser !== this.props.selectedContact && this.state.loading == false){
            console.log ("MESSAGES DID UPDATE")
            
              this.setState({loading: !prevState});
              //this.databaseChangeHandler()
              this.messagesLoader();
              
        }
    }
    

    state = {
        newmessage: '',
        sentMes: null,
        receivedMes: null,
        loading: false,
        targetUser: null,
        targetUserName: null,
        messages: null
    }

    newMsgHandler = (event) => {
        this.setState({newmessage: event.target.value})
    }

    scrollToBottom(){
        this.messagesEnd.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
        this.attentionRemover()
    }

    async databaseChangeHandler(){
        try {
            //this.setState({loading: true})
            await db.ref("users/"+firebaseAuth().currentUser.uid+"/connectedUsers/").on("value", snapshot => {
                console.log('DATABASE CHANGE')
                snapshot.forEach(user => {
                    //savedContacts.push(user.val())
                    if (user.val().attention === true && user.val().uid === this.props.selectedContact ){
                        console.log('ATTENTION TRUE')
                        this.messagesLoader();
                    } 
                });
            //this.setState({loading: false}) 
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    async attentionRemover(){
        try {
            await db.ref("users/"+firebaseAuth().currentUser.uid+"/connectedUsers/"+this.props.selectedContact).set({
                email: this.props.selectedContactName,
                uid: this.props.selectedContact,
                attention: false
            });
            console.log('MESSAGE VIEWED, ATTENTION REMOVED')
        }
        catch (error) {
            console.log(error)
        }
    }

    async messagesLoader2(){
        try {
            this.setState({loading: true})
            let userId = firebaseAuth().currentUser.uid
            let allMessages = []
            console.log('MESSAGES LOADER')
            console.log(allMessages)
            await db.ref("users/"+this.props.selectedContact+"/messages/"+userId).on("value", snapshot => {
                snapshot.forEach(message => {
                    allMessages.push ({
                        ...message.val(),
                        receiver: false
                    })
                });
            //this.setState({sentMes:sentMessages, loading: false, targetUser:this.props.selectedContact}) 
            //this.setState({sentMes:sentMessages, targetUser:this.props.selectedContact}) 
            })
            await db.ref("users/"+userId+"/messages/"+this.props.selectedContact).on("value", snapshot => {
                snapshot.forEach(message => {
                    allMessages.push({
                        ...message.val(),
                        receiver: true
                    });
                })
            //this.setState({receivedMes:receivedMessages, loading: false, messages: allMessages})
            this.setState({messages: allMessages, loading: false, targetUser: this.props.selectedContact, targetUserName:this.props.selectedContactName , newmessage: ''})
            allMessages= []
            })
            
            //console.log(allMessages)
            this.scrollToBottom();

        }
        catch (error) {
            console.log(error)
        }
    }

    async messagesLoader(){
        try {
            this.setState({loading: true})
            let userId = firebaseAuth().currentUser.uid
            let allMessages = []
            console.log('MESSAGES LOADER')
            //console.log(allMessages)

            await db.ref("users/"+this.props.selectedContact+"/messages/"+userId).once("value", snapshot => {
                snapshot.forEach(message => {
                    allMessages.push ({
                        ...message.val(),
                        receiver: false
                    })
                });

                
            })
            await db.ref("users/"+userId+"/messages/"+this.props.selectedContact).once("value", snapshot => {
                snapshot.forEach(message => {
                    allMessages.push({
                        ...message.val(),
                        receiver: true
                    });
                })
            this.setState({messages: allMessages, loading: false, targetUser: this.props.selectedContact, targetUserName:this.props.selectedContactName , newmessage: ''})
            allMessages= []
            })
            this.scrollToBottom();
        }
        catch (error) {
            console.log(error)
        }
    }



    async messageSender(){
        console.log('message sender')
        //console.log(this.state.newmessage)
        try {
            let userId = firebaseAuth().currentUser.uid
            await db.ref("users/"+this.props.selectedContact+"/messages/"+userId).push({
                content: this.state.newmessage,
                time: Date.now()
            })

            //console.log(this.state.messages.length);
            //if (this.state.messages.length === 1){
                //console.log('LENGHT 0 EXAMPLE')
                await db.ref("users/"+this.props.selectedContact+"/connectedUsers/"+userId).set({
                    email: firebaseAuth().currentUser.email,
                    uid: userId,
                    attention: true
                });
                await db.ref("users/"+userId+"/connectedUsers/"+this.props.selectedContact).set({
                    email: this.props.selectedContactName,
                    uid: this.props.selectedContact,
                    attention: false
                });
            //};
            // await db.ref("users/"+this.props.selectedContact+"/connectedUsers/"+userId).update({
            //     attention:true
            // });
            //this.setState({newmessage:''});
            this.messagesLoader();
        }
        catch (error) {
            console.log(error)
        }
    }

    enterSubmitHandler = event => {
        if (event.key === 'Enter'){
            console.log('ENTER')
            //this.setState({newmessage:''})
            this.messageSender()
            //this.messagesLoader()
        }
    }

    render(){
        

        let messages = null;
        let selectedUser = null;
        if (this.state.loading){
            messages = <Loader />;
            selectedUser= 'Loading';
        } else if (!this.state.targetUser){
            messages = '';
            selectedUser = 'Select your contact'
        } else {
            messages = this.state.messages.sort((a,b)=>{
                return a.time - b.time
            }).map (el => {
                return <Message
                        key = {el.time}
                        value = {el.content}
                        receiver = {el.receiver}
                        />
            })
            selectedUser = this.state.targetUserName
        }

        return (
            <div className={classes.MessagesContainer} >
                <div className={classes.SelectedUser}> {selectedUser} </div>
                <div className={classes.MessagesViewed} >
                    {messages}     
                    <div style={{ float:"left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
                    </div>
                </div>

                <div className={classes.NewMessage} >
                    <textarea 
                        className={classes.MessageInput} 
                        placeholder="New message" 
                        width="auto"
                        name="text" 
                        type="text" 
                        value={this.state.newmessage}
                        onChange={this.newMsgHandler}
                        onKeyPress={this.enterSubmitHandler}  />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        selectedContact: state.selectedCon,
        selectedContactName: state.selectedName
    };
};


export default connect(mapStateToProps)(Messages);