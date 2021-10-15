import React, { useState, useContext, useEffect} from 'react'
import { CoinObject } from '../../App'
import {Modal, Button, Dropdown, Navbar, Nav, Form} from 'react-bootstrap'
import { useHistory } from 'react-router-dom';
import Thread from './Thread'
import ForumHome from './ForumHome';
import './message.css'
import axios from 'axios'


function Forum() {
    const coinObject = useContext(CoinObject)
    const { coinChosen, loggedIn, listOfForums, setListOfForums, postList, setPostList, activeUser, forumChosen, setForumChosen} = coinObject;

    const [isNewThread, setIsNewThread] = useState(false)
    const [threadTitle, setThreadTitle] = useState('')
    const [threadTopic, setThreadTopic] = useState('Topics')
    const [threadBody, setThreadBody] = useState('')
    const [isHome ,setIsHome] = useState(true)
    const [key, setKey] = useState('home')

    const history = useHistory()

    const createThread = ()=>{
        let newList = {...JSON.parse(forumChosen[threadTopic])} 
        console.log("threadTopic",threadTopic)
        newList[threadTitle]= {op: activeUser.username, topic:threadTopic, title:threadTitle, body:threadBody, replies:[]}
        let jsonList = JSON.stringify(newList)

        if(threadTopic === "general"){
            var data = {
                "general":`${jsonList}`
            };
        }else if(threadTopic === "technology"){
            var data = {
                "technology":`${jsonList}`
            };
        }else if(threadTopic === "news"){
            var data = {
                "news":`${jsonList}`
            };
        }else if(threadTopic === "rumors"){
            var data = {
                "rumors":`${jsonList}`
            };
        }
         
        var config = {
        method: 'put',
        url: `http://localhost:1337/forums/${forumChosen.id}`,
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
        console.log("posts:",postList)
        setForumChosen(forumChosen, forumChosen[threadTopic] = jsonList)
        postTitles(threadTopic)
        setIsNewThread(false)
    }

    const postTitles = (newKey)=>{
        if(newKey === "home"){
            setIsHome(true)
        }else{
            setIsHome(false)
            let postTitle = ["none"]
            if(forumChosen[newKey] && Object.keys(forumChosen[newKey]).length > 0){
                postTitle =  Object.keys(JSON.parse(forumChosen[newKey]))
                let listOfPosts = postTitle.map((item)=>{
                    let postInfo = JSON.parse(forumChosen[newKey])[item]
                    
                    return(
                        <Thread key = {item} thread = {postInfo} title = {item}/>
                    )
                })
                setKey(newKey)
                setPostList(listOfPosts)
                let theForum = document.getElementById(`${newKey}`)
                history.push(`/components/messaging/Forum#${theForum.hash}`)
            }else{
                setKey(newKey)
                setPostList([])
                let theForum = document.getElementById(`${newKey}`)
                history.push(`/components/messaging/Forum#${theForum.hash}`)
            }
        }

    }
    const launchModal = ()=>{
        if(!loggedIn){
            history.push('/components/signin/SignIn')
        }else{
            setIsNewThread(true)
        }
    }
    const close = ()=>{
        setIsNewThread(false)
    }
    const handleTitle = (e)=>{
        setThreadTitle(e.target.value)
    }
    const handleTopic = (string)=>{
        setThreadTopic(string)
    }
    const handleBody = (e)=>{
        setThreadBody(e.target.value)
    }

    useEffect(()=>{
        postTitles(key)
    },[])

    return (
        <div id="forum-outer-div">
            <div>
            <Navbar id="coin-post-nav"bg="dark" variant="dark">
                <Navbar.Brand href="#home" id="home" className="forum-title" onClick={()=>postTitles("home")}>{coinChosen.name} Forum</Navbar.Brand>
                <Nav className="mr-auto">
                <Nav.Link href="#general" path="/components/messaging/Forum#general" id="general" onClick={()=>postTitles("general")}>General</Nav.Link>
                <Nav.Link href="#technology" id="technology" onClick={()=>postTitles("technology")}>Technology</Nav.Link>
                <Nav.Link href="#news" id="news" onClick={()=>postTitles("news")}>News</Nav.Link>
                <Nav.Link href="#rumors" id="rumors" onClick={()=>postTitles("rumors")}>Rumors</Nav.Link>
                </Nav>
                <Form inline>
                <Button className= "new-thread-btn" type="button" onClick={launchModal}>New Thread</Button>
                </Form>
            </Navbar>
            <div>
                {isHome ? <ForumHome /> : postList}
            </div>
            </div>
            {isNewThread && 
                <Modal.Dialog className="new-thread-modal">
                <Modal.Header closeButton>
                    <Modal.Title>{`Create New Thread`}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <input id = 'thread-title' type='text' placeholder='Enter Title' onChange = {handleTitle}></input>
                    <Dropdown>
                        <Dropdown.Toggle>
                            {threadTopic}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={()=>handleTopic("general")}>
                                General
                            </Dropdown.Item>
                            <Dropdown.Item onClick={()=>handleTopic("technology")}>
                                Technology
                            </Dropdown.Item>
                            <Dropdown.Item onClick={()=>handleTopic("news")}>
                                News
                            </Dropdown.Item>
                            <Dropdown.Item onClick={()=>handleTopic("rumors")}>
                                Rumors
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <textarea id ="text-body" name="text-body" cols="40" rows="5" onChange = {handleBody}></textarea>   
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={close}>Close</Button>
                    <Button variant="primary" onClick={createThread}>Post</Button>
                </Modal.Footer>
                </Modal.Dialog>}
        </div>
    )
}

export default Forum
