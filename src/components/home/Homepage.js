import React, { useContext } from 'react'
import CoinLittleData from '../coinlist/CoinLittleData'
import './home.css'
import { CoinObject } from '../../App'
import CoinProfileLittleData from '../coinlist/CoinProfileLittleData'

function Homepage() {
    const coinObject = useContext(CoinObject);
    const {loggedIn, coinData, coins, activeUser} = coinObject;


    return (
        <div id="homepage">
            <div className = "homepage-div" id = "news-div">News</div>
            <div className = "homepage-div" id = "forums-div">Hot Forums</div>
            <div className = "homepage-div" id = "profile-div">{loggedIn ? 
                <div id = "profile-loggedin-div">
                    <div className="user-profile-home" id="user-profile-home-div">Profile</div>
                    <div className="user-profile-home" id="user-portfolio-div">{activeUser.coinArr.length > 0 && activeUser.coinArr.map((coin)=><div key={coin.id}><CoinProfileLittleData coin = {coin} coins = {coins}/></div>)}</div>
                    <div className="user-profile-home" id="user-messages-home-div">Messages</div>
                </div> 
                : <div>
                    {coinData.map((coin)=><div key={coin.id}><CoinLittleData coin = {coin} coins = {coins}/></div>)}
                </div>}
            </div>
            <div className = "homepage-div" id = "footer-div">footer</div>
        </div>
    )
}

export default Homepage
