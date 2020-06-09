import * as actionTypes from './actionTypes';


export const selectedContact = (uid, name) => {
    return {
        type: actionTypes.SELECTED_CONTACT,
        selectedCon: uid,
        selectedName: name
    };
};