import React, {useContext} from 'react'
import { CoinObject } from '../../App'
import { useHistory } from 'react-router-dom';

function Thread({ thread, title }) {
    const coinObject = useContext(CoinObject)
    const {  setPostChosen} = coinObject;

    const history = useHistory()

    const loadPost = ()=>{
        console.log(thread)
        setPostChosen({title:title, thread:thread})
        history.push('./Post')
    }

    return (
        <div type = "button" className = "thread-title" onClick={loadPost}>
            <span className="post-title-span">{title}</span>
            <span className="post-author-span">posted by {thread.op}</span>
        </div>
    )
}

export default Thread
