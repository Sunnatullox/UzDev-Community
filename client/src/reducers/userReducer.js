export const initialState = null


export const reducer = (state, action) =>{
if(action.type === "User"){
    return action.payload
}
if(action.type === "CLEAR"){
    return null
}
if(action.type === "EDITPROFILE"){
    return {
        ...state,
        userPhoto:action.payload
    }
}


if(action.type ==="EDITNAME"){
    return{
        ...state,
        email:action.payload
    }
}
if(action.type === "EDITEMAIL"){
    return{
        ...state,
        telNumber:action.payload
    }
}
/* if(action.type === "UPDATESPECIALIZATION"){
    return{
        ...state,
        specilization:action.payload
    }
} */

return state
}