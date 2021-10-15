import React, {useState, useEffect, useContext} from 'react'
import './coinlist.css'
import { CoinObject } from '../../App'


function CoinLittleData({coin, coins}) {
    const coinObject = useContext(CoinObject)
    const {thumbnails} = coinObject;
    const [coinName, setCoinName] = useState('');
    const [coinId, setCoinId] = useState('')
    const [coinPrice, setCoinPrice] = useState('')


    useEffect(()=>{
        setCoinName(coin.name)
        setCoinId(coin.id)
        setCoinPrice(`$${(Number(coin.priceUsd)).toFixed(2)}`)
    },[coin])
    return (
        <div className="coin-little-div-grid">
            <div className = "coin-little-thumbnail">{(coinId !== '') ? <span><img className = "coin-thumbnail" alt={coins[coinId]} src={thumbnails[coinId]} /></span> : <span></span>}</div>
            <div className = "coin-little-name">{coinName} </div>
            <div className = "coin-little-price">{(coinPrice !== '') ? <span>{coinPrice}</span>   : <span></span>}</div>
        </div>
    )
}

export default CoinLittleData
