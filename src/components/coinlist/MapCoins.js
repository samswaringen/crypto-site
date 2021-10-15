import React, { useContext} from 'react'
import './coinlist.css'
import { CoinObject } from '../../App'
import CoinData from './CoinData'



function MapCoins() {
    const coinObject = useContext(CoinObject)
    const {coinData, handleSort, sortOrder, totalDataObj, nameArr} = coinObject;

      
    return (
        <div id= "coin-list-outer">
            
            <ol id = "coin-list" >
            <div className = "coin-title-outer">
                <li className = "collapse-btn collapse-btn-title">
                        <div id = "rank-title" className = "coin-data coin-data-title rank" type = "button" onClick = {()=>handleSort('rank')}>Rank{(sortOrder.rank === 'none')?<span></span>:(sortOrder.rank === 'up')?<span> &#8679;</span>:<span> &#8681;</span>}</div>
                        <div id = "coinname-title" className = "coin-data coin-data-title coin-name" type = "button" onClick = {()=>handleSort('coinname')}>Coin Name{(sortOrder.coinname === 'none')?<span></span>:(sortOrder.coinname === 'up')?<span> &#8679;</span>:<span> &#8681;</span>}</div>
                        <div id = "price-title" className = "coin-data coin-data-title price" type = "button" onClick = {()=>handleSort('price')}>Price{(sortOrder.price === 'none')?<span></span>:(sortOrder.price === 'up')?<span> &#8679;</span>:<span> &#8681;</span>}</div>
                        <div id = "totalmarketcap-title" className = "coin-data coin-data-title marketcap" type = "button" onClick = {()=>handleSort('totalmarketcap')}>MarketCap{(sortOrder.totalmarketcap === 'none')?<span></span>:(sortOrder.totalmarketcap === 'up')?<span> &#8679;</span>:<span> &#8681;</span>}</div>
                        <div id = "dominance-title" className = "coin-data coin-data-title dominance" type = "button" onClick = {()=>handleSort('dominance')}>Dominance{(sortOrder.dominance === 'none')?<span></span>:(sortOrder.dominance === 'up')?<span> &#8679;</span>:<span> &#8681;</span>}</div>
                        <div id = "supply-title" className = "coin-data coin-data-title supply" type = "button" onClick = {()=>handleSort('supply')}>Supply{(sortOrder.supply === 'none')?<span></span>:(sortOrder.supply === 'up')?<span> &#8679;</span>:<span> &#8681;</span>}</div>
                        <div id = "maxsupply-title" className = "coin-data coin-data-title max-supply" type = "button" onClick = {()=>handleSort('maxsupply')}>Max Supply{(sortOrder.maxsupply === 'none')?<span></span>:(sortOrder.maxsupply === 'up')?<span> &#8679;</span>:<span> &#8681;</span>}</div>
                        <div id = "change24-title" className = "coin-data coin-data-title change24" type = "button" onClick = {()=>handleSort('change24')}>24hr Change{(sortOrder.change24 === 'none')?<span></span>:(sortOrder.change24 === 'up')?<span> &#8679;</span>:<span> &#8681;</span>}</div>
                </li>
            </div>
                {coinData.map(coin=> <CoinData eventKey = {coin.rank} key = {coin.rank} coin = {coin}  totalDataObj = {totalDataObj} nameArr = {nameArr} />)}     
            </ol>
        </div>
    
    )   
}

export default MapCoins