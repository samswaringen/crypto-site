import React, { useContext } from 'react'
import {Formik, Form, Field, ErrorMessage } from 'formik'
import './signin.css'
import { CoinObject } from '../../App'
import { useHistory } from 'react-router-dom';


const SignIn = ()=> {
    const coinObject = useContext(CoinObject);
    const {userList, setLoggedIn, setActiveUser, goBack,setGoBack} = coinObject;

    let history = useHistory()

    const onSubmit = (values)=>{
        setLoggedIn(true);
        setActiveUser(userList[values.username])
        if(goBack){
            setGoBack(false)
            history.goBack()
        }else{
            history.push('/components/home/Homepage')
        }
           
    }
    const validate = (values)=>{
        let errors = {};
        if(!values.username) {
            errors.username = 'Required'
        }
        if(!userList[values.username]){
            errors.username = "Account doesn't exist"
        } 
        if(!values.password) {
            errors.password = 'Required'
        }else if(values.password.length < 8) {
            errors.password = "Password must be 8 or More Characters"
        } 
        return errors
    }

    return (
        <div id="crypto-signin-form">
            <Formik
            initialValues = {
                {
                    username: "",
                    password:""   
                }
            }
            onSubmit = {onSubmit}
            validate={validate}
            >
                <div id="crypto-sign-in">
                    <h1>Sign In</h1>
                    <Form><div>
                            <Field name="username" type='input' placeholder="Enter Username"></Field>
                        <div><ErrorMessage name="username"/></div>
                        </div>
                        <div>
                            <Field name="password" type='input' placeholder="Enter Password"></Field>
                        <div><ErrorMessage name="password"/></div>
                        </div>
                        <button type="submit">Submit</button>
                    </Form>
                </div>
            </Formik>
        </div>
    )
    

    }

export default SignIn
