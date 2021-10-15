import React, {useContext, useState} from 'react'
import { CoinObject } from '../../App'
import { useHistory } from 'react-router-dom';
import {Modal, Button} from 'react-bootstrap'
import { useMutation,  gql } from "@apollo/client";
import {makeid} from '../idgenerator'



function BuyCoin({ coin }) {
    const coinObject = useContext(CoinObject)
    const {loggedIn, activeUser, getUsers, userList, setActiveUser, setGoBack} = coinObject;

    const [clicked, setClicked] = useState(false)
    const [isFiat, setIsFiat] = useState(true)
    const [price, setPrice] = useState(0)
    const [coinAmount, setCoinAmount] = useState(0)

    const history = useHistory();

    const BUY_COIN  = gql`
    mutation BUY_COIN($userId:String!, $coinId: String!, $amount: Int!, $id: String, $dateTime: String,$coinAmount: Int,$currentCoinVal: Int, $fees: Int!){
        editUserCoin(userId:$userId, coinId:$coinId, amount:$amount, newTrans: {
            id: $id
            dateTime: $dateTime,
            coinId: $coinId,
            coinAmount: $coinAmount,
            currentCoinVal: $currentCoinVal, 
            fees: $fees
        }){
            amount
        }
    }
    `
    const [editUserCoin, {loading,error,data}] = useMutation(BUY_COIN)

    const buy = ()=>{
        if(!loggedIn){
            setGoBack(true)
            history.push('/components/signin/SignIn')
        }else{
            setClicked(!clicked)
            console.log("price",coin)
            setPrice(Number(coin.priceUsd))
        }
    }
    
    const handlePurchase = (e)=>{
        setCoinAmount((Number(e.target.value)/price).toFixed(8))
    }

    const purchase = ()=>{
        let deduct = document.getElementById('purchase-input').value
        let newCapital = activeUser.capital - deduct
        let currentPortfolio = {...activeUser.coins}
        let currentArray = [...activeUser.coinArr]
        let newDate = new Date();
        let transID = makeid(10)
        if(currentPortfolio[coin.id]){
            let oldAmount = Number(currentPortfolio[coin.id])
            let newAmount = oldAmount + Number(coinAmount);
            currentPortfolio[coin.id] = newAmount
            let current = currentArray.filter(item=> item[0] === coin.id)
            let index = 0
            currentArray.map((item,i)=> {
                if(item[0] === coin.id){
                    index = i
                }
            })
            current[0][1] = newAmount
            currentArray.splice(index,1,current[0])
                
        }else{
            currentPortfolio[coin.id] = Number(coinAmount)
            let newCoin = [coin.id,coinAmount]
            currentArray.push(newCoin)
        } 
        editUserCoin({variables:{userId: activeUser.id, coinId: coin.id, amount: coinAmount, id: transID, dateTime: newDate,coinAmount: coinAmount,currentCoinVal: coin.priceUsd, fees: 0}})
        setActiveUser(userList[activeUser.username], userList[activeUser.username].capital = newCapital, userList[activeUser.username].coins = currentPortfolio, userList[activeUser.username].coinArr = currentArray)
        buy()
    }


    return (
        <div>
        <button className= "buy-btn" onClick={buy}>
            Buy
        </button>
        {clicked && 
            <Modal.Dialog className="buy-modal">
            <Modal.Header closeButton>
                <Modal.Title>{`Buy ${coin.name}`}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {`Available Funds: $${activeUser.capital}`}
                <input id = 'purchase-input' type='number' placeholder='Enter Amount' onChange={handlePurchase}></input>
                {isFiat ? <div>{`Total ${coin.id}: ${coinAmount}`}</div> : <div></div>}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={buy}>Close</Button>
                <Button variant="primary" onClick={purchase}>Purchase</Button>
            </Modal.Footer>
            </Modal.Dialog>
        }
        </div>
    )
}

export default BuyCoin
