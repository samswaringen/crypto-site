import React, {useContext, useState} from 'react'
import { CoinObject } from '../../App'
import { useHistory } from 'react-router-dom';
import {Modal, Button} from 'react-bootstrap'

function SellCoin({ coin }) {
    const coinObject = useContext(CoinObject)
    const {loggedIn, activeUser, getUsers, setActiveUser, userList, thumbnails, setGoBack} = coinObject;

    const [clicked, setClicked] = useState(false)
    const [price, setPrice] = useState(0)
    const [capitalAmount, setCapitalAmount] = useState(0)

    const history = useHistory();

    const sell=()=>{
        console.log(thumbnails[coin.id])
        if(!loggedIn){
            setGoBack(true)
            history.push('/components/signin/SignIn')
        }else{
            setClicked(!clicked)
            setPrice(Number(coin.priceUsd))
        }
    }

    const handleSale = (e)=>{
        setCapitalAmount((Number(e.target.value)*price).toFixed(8))
    }

    const getCapital = ()=>{
        let deduct = document.getElementById('sell-input').value
        let cashBack = deduct*price
        let newCapital = activeUser.capital + cashBack;
        let coinAmount = 0;
        if(activeUser.coins[coin.id]){
            coinAmount = activeUser.coins[coin.id]
        }
        let newCoin = coinAmount - deduct;
        let currentPortfolio = {...activeUser.coins}
        let currentArray = [...activeUser.coinArr]
        let current = currentArray.filter(item=> item[0] === coin.id)
        let index = 0
        currentArray.map((item,i)=> {
            if(item[0] === coin.id){
                index = i
            }  
        })
        current[0][1] = newCoin
        currentArray.splice(index,1,current[0])
        currentPortfolio[coin.id] = newCoin 
        let jsonFolio = JSON.stringify(currentPortfolio);  
        
        var axios = require('axios');
        var data = {
        "capital": `${newCapital}`,
        "coins": `${jsonFolio}`
        };

        var config = {
        method: 'put',
        url: `http://localhost:1337/crypto-users/${activeUser.id}`,
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
        };

        axios(config)
        .then(function (response) {
        console.log(JSON.stringify(response.data));
        getUsers()
        setActiveUser(userList[activeUser.username], userList[activeUser.username].capital = newCapital, userList[activeUser.username].coins = currentPortfolio, userList[activeUser.username].coinArr = currentArray)
        })
        .catch(function (error) {
        console.log(error);
        });
        sell()
    }


    return (
        <div>
            <button className= "sell-btn" onClick={sell}>
                Sell
            </button>
            {clicked && 
                <Modal.Dialog className="sell-modal">
                <Modal.Header closeButton>
                    <Modal.Title>{`Sell ${coin.name}`}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                Available Funds: {<img src={thumbnails[coin.id]}></img>} {activeUser.coins[coin.id] ? activeUser.coins[coin.id].toFixed(8) : 0.00000000}
                <input id = 'sell-input' type='number' placeholder='Enter Amount' onChange={handleSale}></input>
                <div>{`Total USD: ${capitalAmount}`}</div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={sell}>Close</Button>
                    <Button variant="primary" onClick={getCapital}>Sell</Button>
                </Modal.Footer>
                </Modal.Dialog>
            }
        </div>
    )
}

export default SellCoin
