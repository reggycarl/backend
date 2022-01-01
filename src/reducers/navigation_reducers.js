

const navigation_reducer = (initialState = { user: JSON.parse(localStorage.getItem("user"))}, action  => {



    switch (action.TYPE){
    case "SAVE_USER": 

    break;
    default:
        return initialState
        break;}
}
)