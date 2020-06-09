import * as actionTypes from '../actions/actionTypes';

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    selectedCon: null,
    selectedName: null
}



const reducer = (state=initialState, action) => {
    switch (action.type){
        case actionTypes.AUTH_START:
            return {
                ...state,
                loading: true
            }
        case actionTypes.AUTH_SUCCESS:
            return {
                token: action.token,
                userId: action.userId,
                error:null,
                loading: false
            }
        case actionTypes.AUTH_FAIL:
            return {
                ...state,
                loading: false,
                error: action.error
            }
        case actionTypes.SELECTED_CONTACT:
            return {
                ...state,
                selectedCon:action.selectedCon,
                selectedName: action.selectedName
            }
        default:
            return state
    }
};

export default reducer;