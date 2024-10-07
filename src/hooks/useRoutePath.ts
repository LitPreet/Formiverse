export const useRoutePath = () => {
    const path = {
        registerUser:"/register-user",
        login: "/login",
        dashboard: "/dashboard",
        form: "/form/:id",
        formSettings: "/form/:id/settings", 
        formResponses: "/form/:id/responses",
        home:"/"
    }
    return path
}