import React, {useContext} from 'react'
import { useHistory } from 'react-router-dom';
import { CoinObject } from '../../App'

function Logout() {
    const coinObject = useContext(CoinObject);
    const {setLoggedIn} = coinObject;
    let history = useHistory();

    
    setLoggedIn(false)
    setTimeout(()=>{
        history.push("/components/home/Homepage")
    }, 1000)
    return (
        <div>
            You've been logged out!
        </div>
    )
}

export default Logout
