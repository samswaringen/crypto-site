import React, {useState, useContext} from 'react'
import { CoinObject } from '../../App'
import {Modal, Button} from 'react-bootstrap'
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import './message.css'

function Post() {
    const coinObject = useContext(CoinObject)
    const { postChosen, setPostChosen, listOfForums, coinChosen, activeUser, loggedIn, setGoBack, forumChosen, setForumChosen} = coinObject;

    const [isReply, setIsReply] = useState(false)
    const [replyTitle, setReplyTitle] = useState('')
    const [replyBody,setReplyBody] = useState('')

    const history = useHistory()

    const backToThreads = ()=>{
        history.goBack()
    }

    const reply = ()=>{
        if(!loggedIn){
            setGoBack(true)
            history.push('/components/signin/SignIn')
        }else{
            setIsReply(true)
        }
    }
    const handleTitle = (e)=>{
        setReplyTitle(e.target.value)
    }
    const handleBody = (e)=>{
        setReplyBody(e.target.value)
    }
    const closeReply = ()=>{
        setIsReply(false)
    }
    const postReply = ()=>{
        if(!loggedIn){
            setGoBack(true)
            history.push('/components/signin/SignIn')
        }else{
        let username = activeUser.username
        let thread = {...JSON.parse(forumChosen[postChosen.thread.topic])}
        console.log("thread",thread)
        thread[postChosen.thread.title].replies.push({title:replyTitle, body: replyBody, username:username, replies: []})
        let jsonList = JSON.stringify(thread)
        setForumChosen(forumChosen, forumChosen[postChosen.thread.topic] = jsonList)
        console.log("post chosen:",postChosen)
        console.log("thread",thread)
        console.log("forumChosen", forumChosen)
        setPostChosen(postChosen, postChosen.thread = {...thread[postChosen.title]})
       
        if(postChosen.thread.topic === "general"){
            var data = {
                "general":`${jsonList}`
            };
        }else if(postChosen.thread.topic === "technology"){
            var data = {
                "technology":`${jsonList}`
            };
        }else if(postChosen.thread.topic === "news"){
            var data = {
                "news":`${jsonList}`
            };
        }else if(postChosen.thread.topic === "rumors"){
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
          
        closeReply()
        }
    }

    return (
        <div>
            <div className="post-div">
                <h1>{postChosen.title}</h1>
                <div><strong>{postChosen.thread.op}</strong></div>
                <div>{postChosen.thread.body}</div>
                
                <button type="button" onClick={backToThreads}>Back to Threads</button>
                <button type="button" onClick={reply}>Reply</button>
            </div>
            {isReply &&      
                <Modal.Dialog className="new-thread-modal">
                    <Modal.Header >
                        <Modal.Title>{`Create New Thread`}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <input id = 'thread-title' type='text' placeholder='Enter Title' onChange={handleTitle}></input>
                        <textarea id ="text-body" name="text-body" cols="40" rows="5" onChange={handleBody}></textarea>   
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeReply}>Close</Button>
                        <Button variant="primary" onClick={postReply}>Post</Button>
                    </Modal.Footer>
                </Modal.Dialog>}
                <div className="reply-div"> <strong>Replies</strong>
                    <div>
                        {postChosen.thread.replies.map(item=>
                            <div>Reply to {forumChosen.id} {JSON.stringify(item)}
                                <button type="button" onClick={reply}>Reply</button>
                            </div>
                        )}
                    </div>
                </div>
        </div>
    )
}

export default Post
