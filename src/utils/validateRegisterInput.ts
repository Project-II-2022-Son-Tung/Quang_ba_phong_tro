import { IRegisterInput } from "../types/RegisterInput";

export const validateRegisterInput = (registerInput: IRegisterInput) => {
    if(registerInput.fullName === "") {
        return [
            {
                field: 'fullName',
                message: 'Full name is required'
            }
        ]
    }
    if(registerInput.email === "") {
        return [
            {
                field: 'email',
                message: 'Email is required'
            }
        ]
    }
    if(registerInput.username === "") {
        return [
            {
                field: 'username',
                message: 'Username is required'
            }
        ]
    }
    if(registerInput.password === "") {
        return [
            {
                field: 'password',
                message: 'Password is required'
            }
        ]
    }


    if(!registerInput.email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
        return {
            message: "Email is invalid",
            errors:[
                {
                    field: "email",
                    message: "Email is invalid"
                }
            ]
        }
    }
    if(registerInput.username.length <= 5) {
        return {
            message: "Username must be at least 6 characters",
            errors:[
                {
                    field: "username",
                    message: "Username must be at least 6 characters"
                }
            ]
        }
    }
    if(registerInput.password.length <= 5) {
        return {
            message: "Password must be at least 6 characters",
            errors:[
                {
                    field: "password",
                    message: "Password must be at least 6 characters"
                }
            ]
        }
    }
    return null;
}