import React, { useEffect, useContext} from 'react'
import './coinlist.css'
import { CoinObject } from '../../App'
import MapCoins from './MapCoins'






function CoinNews({ news }){
    return (
        <div className = "news-title">
            {<a href = {news.url}>{news.title}</a>}
        </div>
    )
}



function FetchData() {
    const coinObject = useContext(CoinObject)
    const {coinData,  setTotalVal} = coinObject;


    useEffect(()=>{
        setTotalVal(()=>{
            let total = 0;
            coinData.map(item=>{
                total += Number(item.marketCapUsd)
            })
            return total;
        });
    },[coinData]);

    return (
        <div id="crypto-data">
            <div id="list-div">                
                <div id="coin-data-div">
                    <MapCoins /> 
                </div>  
            </div>
        </div>
    )
}

export default FetchData
