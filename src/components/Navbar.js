import React, {useContext} from 'react'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import { CoinObject } from '../App'
import { Link } from "react-router-dom";

function Navbar() {
    const coinObject = useContext(CoinObject);
    const {loggedIn} = coinObject;

    return (
        <div>
            <Nav id = "navbar"  variant="dark">
                <div className="home-div">
                    <Link to = "/components/home/Homepage" className="main-nav-item" >Home</Link>
                </div>
                <span className="search-div">
                <Form inline>
                    <FormControl type="text" placeholder="Search" id="search-input" />
                    <Button id="search-button" variant="outline-info">Go</Button>
                </Form>
                </span>
                <div className = "list-div">
                    <Link to = "/components/coinlist/FetchData" className="main-nav-item" >List</Link>
                </div>
                <div className = "forums-div">
                    <Link to = "/components/messaging/ListofGroups" className="main-nav-item" >Forums</Link>
                </div>
                {loggedIn ? <>
                <div className = "chats-div">
                    <Link to = "/components/chats/Chats" className="main-nav-item" >Chats</Link>
                </div>
                <div className = "profile-div">
                    <Link to = "/components/profile/Profile" className="main-nav-item" >Profile</Link>
                </div>
                <div className = "logout-div">
                    <Link to = "/components/logout/Logout" className="main-nav-item" >Logout</Link>
                </div>
                    </> : <>
                <div className = "signin-div">
                    <Link to = "/components/signin/SignIn" className="main-nav-item" id="signin" >Sign In</Link>
                </div>
                <div className = "signup-div">
                    <Link to = "/components/signup/SignUp" className="main-nav-item" id="signup" >Sign Up</Link>
                </div>
                    </>
                }
            </Nav>
        </div>
    )
}

export default Navbar
