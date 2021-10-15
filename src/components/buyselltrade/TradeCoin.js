import React, {useContext, useState} from 'react'
import { CoinObject } from '../../App'
import { useHistory } from 'react-router-dom';
import {Modal, Button, Dropdown} from 'react-bootstrap'

function TradeCoin({ coin }) {
    const coinObject = useContext(CoinObject)
    const {loggedIn, activeUser, thumbnails, coinData, getUsers, setActiveUser, userList, setGoBack} = coinObject;

    const [clicked, setClicked] = useState(false)
    const [isSelected, setIsSelected] = useState(false)
    const [selectedCoin, setSelectedCoin] = useState()
    const [coinAmount, setCoinAmount] = useState(0)
    const [coinPrice, setCoinPrice] = useState(0)
    const [inputAmount, setInputAmount] = useState(0)
    const [tradeAmount, setTradeAmount] = useState(0)

    const history = useHistory();

    const trade=()=>{
        if(!loggedIn){
            setGoBack(true)
            history.push('/components/signin/SignIn')
        }else{
            setClicked(!clicked)
            setSelectedCoin()
            setCoinPrice(0)
            setCoinAmount(0)
            setInputAmount(0)
        }
    }

    const handleAmount = (e)=>{
        let input = e.target.value
        setInputAmount(input)
        setTradeAmount((input*coinPrice)/(Number(coin.priceUsd)))
    }

    const chooseCoin =(clicked)=>{
        let chosen = coinData.filter(item=>item.id === clicked[0])
        setCoinPrice(Number(chosen[0].priceUsd).toFixed(8))
        setSelectedCoin(clicked[0])
        setCoinAmount(clicked[1].toFixed(8))
        setIsSelected(true)
    }

    const tradeCoins = ()=>{
        let oldCoinAmount = coinAmount - inputAmount
        let newCoinAmount = activeUser.coins[coin.id] + tradeAmount
        let currentPortfolio = {...activeUser.coins}
        let currentArray = [...activeUser.coinArr]
        if(currentPortfolio[coin.id]){
            currentPortfolio[coin.id] = newCoinAmount
            currentPortfolio[selectedCoin] = oldCoinAmount
            let currentNew = currentArray.filter(item=> item[0] === coin.id)
            let currentOld = currentArray.filter(item=> item[0] === selectedCoin)
            let indexNew = 0
            let indexOld = 0
            currentArray.map((item,index)=> {
                if(item[0] === coin.id){
                    indexNew = index
                }    
            })
            currentArray.map((item,index)=> {
                if(item[0] === selectedCoin){
                    indexOld = index   
                }  
            })
            console.log("new",indexNew)
            console.log("old",indexOld)
            currentNew[0][1] = newCoinAmount
            currentArray.splice(indexNew,1,currentNew[0])
            currentOld[0][1] = oldCoinAmount
            currentArray.splice(indexOld,1,currentOld[0])
        }else {
            currentPortfolio[selectedCoin] = oldCoinAmount
            currentPortfolio[coin.id] = tradeAmount
            let currentOld = currentArray.filter(item=> item[0] === selectedCoin)
            let indexOld = currentArray.map((item,index)=> {
                if(item[0] === selectedCoin){
                    return index
                }     
            })
            currentOld[0][1] = oldCoinAmount
            currentArray.splice(indexOld,1,currentOld[0])
            let newCoin = [coin.id,tradeAmount]
            currentArray.push(newCoin)
            
        }
        let jsonFolio = JSON.stringify(currentPortfolio); 

        var axios = require('axios');
        var data = {
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
        setActiveUser(userList[activeUser.username], userList[activeUser.username].coins = currentPortfolio, userList[activeUser.username].coinArr = currentArray)
        })
        .catch(function (error) {
        console.log(error);
        });
        console.log("currentArray",currentArray)
       trade() 
    }

    return (
        <div>
            <button className= "trade-btn" onClick={trade}>
                Trade
            </button>
            {clicked && 
                <Modal.Dialog className="trade-modal">
                <Modal.Header closeButton>
                    <Modal.Title>{`Trade for ${coin.name} $${Number(coin.priceUsd).toFixed(2)}`}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Dropdown>
                        <Dropdown.Toggle>
                            Portfolio
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {activeUser.coinArr.map(item=><div><Dropdown.Item onClick={()=>chooseCoin(item)}>{<img alt={thumbnails[item[0]]} src={thumbnails[item[0]]}></img>}{<strong>{` ${item[0]} : `}</strong>}{<strong>{item[1]}</strong>}</Dropdown.Item></div>)}
                        </Dropdown.Menu>
                    </Dropdown>
                    {isSelected && 
                    <div>
                        <div>{<img alt = {thumbnails[selectedCoin]} src={thumbnails[selectedCoin]}></img>}{selectedCoin} : {coinAmount}</div>
                        <div>Coin Price: {coinPrice}</div>
                        <input id="trade-input" type='number' placeholder="Enter amount" onChange={handleAmount}></input>
                        <div>Will Recieve {tradeAmount}</div>
                    </div>}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={trade}>Close</Button>
                    <Button variant="primary" disabled={!isSelected} onClick={tradeCoins}>Trade</Button>
                </Modal.Footer>
                </Modal.Dialog>
            }
        </div>
    )
}

export default TradeCoin
