export const SWITCH_APP = "SWITCH_APP";
export const TOGGLE_APP_DRAWER = "TOGGLE_APP_DRAWER"


export const switch_app = (app) => {
    console.log("SWITCHING IN ACTIONS", app)

    return { type: SWITCH_APP, app }
}

export const toggle_app_drawer = () => 
{
    console.log("SHOWING DRAWER")
    return {type: TOGGLE_APP_DRAWER}
}
