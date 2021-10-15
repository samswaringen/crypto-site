import React, {useState, useEffect, useContext} from 'react'
import './coinlist.css'
import { CoinObject } from '../../App'

function CoinProfileLittleData({ coin, coins }) {
    const coinObject = useContext(CoinObject)
    const {coinData, thumbnails} = coinObject;
    const [coinName, setCoinName] = useState('');
    const [coinId, setCoinId] = useState('')
    const [coinPrice, setCoinPrice] = useState(0)
    

    useEffect(()=>{
        console.log("coin in profile coin", coin)
        setCoinName(coin.name)
        setCoinId(coin.id)
        let coinAmount = Number(coin.amount).toFixed(2)
        let coinChosen = coinData.filter(item=>item.id === coin.id)
        console.log("coinchosen",coinChosen[0])
        if(coinChosen.length>0){
            setCoinPrice(`$${(Number(coinChosen[0].priceUsd)*coinAmount).toFixed(2)}`)
        }
    },[coin])
    return (
        <div className="coin-little-div-grid">
            <div className = "coin-little-thumbnail">{(coinId !== '') ? <span><img className = "coin-thumbnail" alt={coins[coinId]} src={thumbnails[coinId]} /></span> : <span></span>}</div>
            <div className = "coin-little-name">{coinName} </div>
            <div className = "coin-little-price">{(coinPrice !== '') ? <span>{coinPrice}</span>   : <span></span>}</div>
        </div>
    )
}

export default CoinProfileLittleData

