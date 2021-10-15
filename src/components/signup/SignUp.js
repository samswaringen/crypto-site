import React, { useContext} from 'react'
import {Formik, Form, Field, ErrorMessage } from 'formik'
import './signup.css'
import { CoinObject } from '../../App'
import { useHistory } from 'react-router-dom';
import axios from 'axios'
import { makeid } from '../idgenerator';

function SignUp() {
    const coinObject = useContext(CoinObject);
    const {userList, setUserList, emailList, setEmailList} = coinObject;

    let history = useHistory()

    const onSubmit = (values)=>{
        let id = makeid(32)
        setUserList(userList, userList[values.username]= {email:values.email, password:values.password, name:values.name, capital: 25000, coins:{}, chats:{}, threads:{}});
        if(values.username !== ""){
            let data = JSON.stringify({
                "id":`${id}`,
                "username": `${values.username}`,
                "email": `${values.email}`,
                "name": `${values.name}`,
                "capital": 25000,
                "coins": "{}",
                "chats": "{}",
                "threads": "{}"

            });

            let config = {
                method: 'post',
                url: 'http://localhost:5000/addUser',
                headers: { 
                    'Content-Type': 'application/json'
                },
                data : data
            };

            axios(config)
            .then(function (response) {
            console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
            console.log(error);
            });
        }
        setEmailList(emailList, emailList[values.email]={username:values.username})
        history.push('/components/signin/SignIn')
    }
    const validate = (values)=>{
        let errors = {};
        if(!values.username) {
            errors.username = 'Required'
        }else if(userList[values.username]){
            errors.username = "Username taken!"
        } 
        if(!values.name) {
            errors.name = 'Required'
        } 
        if(!values.email) {
            errors.email = 'Required'
        }else if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]{2,4}$/.test(values.email)) { 
             errors.email = "Not a valid email"
        }else if(emailList[values.email]){
            errors.email = "Email linked to another account"
        } 
        if(!values.password) {
            errors.password = 'Required'
        }else if(values.password.length < 8) {
            errors.password = "Password must be 8 or More Characters"
        }
        if(values.password !== values.verifyPassword){
            errors.password = "Passwords don't match!"
            errors.verifyPassword = "Passwords don't match!"
        } 
        return errors
    }
    return (
        <div id="crypto-signup-form">
            <Formik
                initialValues = {
                    {
                        username: "",
                        email:"",
                        name:"",
                        password:"",    
                        verifyPassword: ""
                    }
                }
                onSubmit = {onSubmit}
                validate = {validate}
                >
                <div id="crypto-sign-up">
                    <h1>Sign Up</h1>
                    <Form><div>
                            <Field name="username" type='input' placeholder="Enter Username"></Field>
                        </div>
                        <div>
                            <ErrorMessage name= "username" />
                        </div>
                        <div>
                            <Field name="email" type='email' placeholder="Enter Email"></Field>
                        </div>
                        <div>
                            <ErrorMessage name= "email" />
                        </div>
                        <div>
                            <Field name="name" type='input' placeholder="Enter Name"></Field>
                        </div>
                        <div>
                            <ErrorMessage name= "name" />
                        </div>
                        <div>
                            <Field name="password" type='input' placeholder="Enter Password"></Field>
                        </div>
                        <div>
                            <ErrorMessage name= "password" />
                        </div>
                        <div>
                            <Field name="verifyPassword" type='input' placeholder="Verify Password"></Field>
                        </div>
                        <div>
                            <ErrorMessage name= "verifyPassword" />
                        </div>
                        <button type="submit">Submit</button>
                    </Form>
                </div>
            </Formik>
        </div>
    )
}

export default SignUp
