import {isValidEmail} from '6pp'
export const emailValidator = (email) =>{
    if(!isValidEmail(email))
        return {isValid:false, errorMessage:"Invalid Username"}; 
}