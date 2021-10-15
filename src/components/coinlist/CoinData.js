import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import {Line} from 'react-chartjs-2'
import './coinlist.css'
import Collapse from 'react-bootstrap/Collapse'
import { CoinObject } from '../../App'
import BuyCoin from '../buyselltrade/BuyCoin'
import SellCoin from '../buyselltrade/SellCoin'
import TradeCoin from '../buyselltrade/TradeCoin'

const infoObject= {};


function CoinData({ coin, totalDataObj, nameArr }){
    const coinObject = useContext(CoinObject)
    const {totalVal, coins} = coinObject;

    const [open, setOpen] = useState(false);
    const [isNegative, setIsNegative] = useState(false);
    const [coinInfo, setCoinInfo] = useState({})
    const [rankUp, setRankUp] = useState(0);
    const [priceData, setPriceData] = useState([])
    const [fetched , setFetched] = useState(false)
     
    const coinPressed = async()=>{        
        if(!fetched){
                try{
                    let coinGecko = await axios(`https://api.coingecko.com/api/v3/coins/${coin.id}`)
                    //let url = `https://newsapi.org/v2/everything?q=${coin.name}&from=2021-05-21&sortBy=popularity&apiKey=4c6223fc03284828828f00dea9df45e0`;
                    //let req2 = await axios(`https://gnews.io/api/v4/search?q=${coin.name}%20coin&lang=en&token=796224b764bfe17f70d506540822b426`)
                    //let altNews = req2.data.articles;
                    //let req = await axios(url);
                    //let news = req.data.articles;
                   // let news = [...altNews, ...firstNews]
                    infoObject[coin.id] = coinGecko;
                    let homepage = infoObject[coin.id].data.links.homepage[0];
                    let reddit = infoObject[coin.id].data.links.subreddit_url;
                    let twitter = infoObject[coin.id].data.links.twitter_screen_name;
                    let description = infoObject[coin.id].data.description.en;
                    let ath = infoObject[coin.id].data.market_data.ath.usd
                    let athDate = infoObject[coin.id].data.market_data.ath_date.usd;
                    let high24 = infoObject[coin.id].data.market_data.high_24h.usd;
                    let low24 = infoObject[coin.id].data.market_data.low_24h.usd;
                    let volume24 = infoObject[coin.id].data.market_data.total_volume.usd;
                    document.getElementById(`description-div-${coin.id}`).innerHTML = description;
                    setFetched(true)
                    setCoinInfo(coinInfo,
                        coinInfo.homepage = homepage,
                        coinInfo.reddit = reddit,
                        coinInfo.twitter = `https://twitter.com/${twitter}`, 
                        coinInfo.description = description, 
                        coinInfo.ath = ath, 
                        coinInfo.athdate = athDate,
                        coinInfo.high24 = high24,
                        coinInfo.low24 = low24,
                        coinInfo.volume24 = volume24.toLocaleString('en-US'),
                        //coinInfo.news = news
                        );
                }catch(e){
                    if(e.request.status === 404){
                        infoObject[coin.id] = 'none'
                    }
                }
            }
        setOpen(!open)     
    }

    useEffect(()=>{
        let symbol = '';
        let data;
        if(totalDataObj[coin.id]){
            data = totalDataObj[coin.id].price;
            setPriceData(data);
        }else{
            totalDataObj[coin.id].price = coin.price;
        }
        if(coin.changePercent24Hr != null){
            symbol = coin.changePercent24Hr.split('')[0];
        }
        (symbol === '-')?document.getElementById(`${coinId24}`).classList.add('negative'):document.getElementById(`${coinId24}`).classList.add('positive')
        if(data){ 
            if(Number(coin.priceUsd) > data[data.length-2]){
                setIsNegative(false)
                document.getElementById(`${coinIdPrice}`).classList.add('positive')
                document.getElementById(`${coinIdPrice}`).classList.remove('negative')
            }else{
                setIsNegative(true)
                document.getElementById(`${coinIdPrice}`).classList.add('negative')
                document.getElementById(`${coinIdPrice}`).classList.remove('positive')
            }
            if(coin.rank < totalDataObj[coin.id].rank){
                document.getElementById(`${coin.id}rank`).classList.add('positive')
                document.getElementById(`${coin.id}rank`).classList.remove('negative')
                document.getElementById(`${coin.id}outer`).classList.add('positive-box')
                document.getElementById(`${coin.id}outer`).classList.remove('negative-box')
                setRankUp(1);
            }else if (coin.rank > totalDataObj[coin.id].rank){
                document.getElementById(`${coin.id}rank`).classList.add('negative')
                document.getElementById(`${coin.id}rank`).classList.remove('positive')
                document.getElementById(`${coin.id}outer`).classList.add('negative-box')
                document.getElementById(`${coin.id}outer`).classList.remove('positive-box')
                setRankUp(-1);
            }else if (coin.rank === totalDataObj[coin.id].rank){
                setRankUp(0)
            }
        }
    },[coin])

    const figureDom = (total, value)=>{
        let percent = ((value/total)*100).toFixed(2);
        return percent
    }
    const coinId24 = `${coin.id}24`;
    const coinIdPrice = `${coin.id}price`

    //{coinInfo.news && coinInfo.news.map((item)=><CoinNews news = {item} />)}
    return (
        <div className = "coin-div-outer">
            <li key ={coin.id} id ={`${coin.id}outer`} className = 'coin-div' data-parent="#coin-list">
                        <div
                            type='button'
                            onClick={coinPressed}
                            id = {coin.id}
                            aria-controls={coin.rank}
                            aria-expanded={false}
                            className = "collapse-btn"
                        >
                        <div id = {`${coin.id}rank`}className = "coin-data rank">{coin.rank}{(rankUp === 0) ? <span></span> : (rankUp < 0) ? <span>&#8681;</span> :  <span>&#8679;</span>}</div>
                        <div className = "coin-data coin-name"><img className = "coin-thumbnail" alt = {coins[coin.id]} src = {coins[coin.id]} /> {coin.name}</div><span id = {coinIdPrice}className='price'>${Number(coin.priceUsd).toLocaleString('en-US')}{isNegative ? <span>&#8681;</span>:<span>&#8679;</span> }</span>
                        <div className = "coin-data marketcap">${Number(coin.marketCapUsd).toLocaleString('en-US')}</div>
                        <div className = "coin-data dominance">{figureDom(totalVal, Number(coin.marketCapUsd))}%</div>
                        <div className = "coin-data supply">{Number(coin.supply).toLocaleString('en-US')}</div>
                        <div className = "coin-data max-supply">{Number(coin.maxSupply).toLocaleString('en-US')}</div>
                        <div id={coinId24} className = "coin-data change24">{Number(coin.changePercent24Hr).toLocaleString('en-US')}%</div>
                        </div>
                        <div  >
                            <Collapse id ={coin.rank} className="collapse-inside" in={open}>
                                <div id="collapse-inside-div"> 
                                    <div id="coin-news">
                                        <div id="coin-news-title">{coin.name} News</div>
                                        <div className = "news-scrollable">
                                        
                                        </div>
                                    </div>
                                    <div id="coin-info">
                                        <div id="coin-info-title">{coin.name} Info</div>
                                        <div className = "coin-items item1"><a href = {coinInfo.homepage}>Homepage</a></div>
                                        <div className = "coin-items item2"><a href = {coinInfo.reddit}>Reddit</a></div>
                                        <div className = "coin-items item3"><a href = {coinInfo.twitter}>Twitter</a></div>
                                        <div className = "coin-items item4">All Time High of ${coinInfo.ath} on</div>
                                        <div className = "coin-items item5">{coinInfo.athdate}</div>
                                        <div className = "coin-items item6">24hr High: ${coinInfo.high24}</div>
                                        <div className = "coin-items item7">24hr Low: ${coinInfo.low24}</div>
                                        <div className = "coin-items item8">24hr Volume</div>
                                        <div className = "coin-items item9">${coinInfo.volume24}</div>
                                    </div>
                                    <div className='line-graph'>   
                                    <Line 
                                        className = "graph"
                                        data={{
                                            labels: nameArr,
                                            datasets: [
                                                {
                                                    label: coin.name,
                                                    fill: false,
                                                    lineTension: 0.1,
                                                    backgroundColor: 'rgba(75,192,192,1)',
                                                    borderColor: 'rgba(0,0,0,1)',
                                                    borderWidth: 1,
                                                    data: priceData
                                                }
                                            ]
                                        }}
                                        options={{
                                            title:{
                                                display:true,
                                                text: coin.name,
                                                fontSize:20
                                            },
                                            legend:{
                                            display:true,
                                            position:'right'
                                            }   
                                        }}
                                    />    
                                </div>
                                <div className="history-graph">
                                <Line 
                                        className = "graph"
                                        data={{
                                            labels: nameArr,
                                            datasets: [
                                                {
                                                    label: coin.name,
                                                    fill: false,
                                                    lineTension: 0.1,
                                                    backgroundColor: 'rgba(75,192,192,1)',
                                                    borderColor: 'rgba(0,0,0,1)',
                                                    borderWidth: 1,
                                                    data: priceData
                                                }
                                            ]
                                        }}
                                        options={{
                                            title:{
                                                display:true,
                                                text: coin.name,
                                                fontSize:20
                                            },
                                            legend:{
                                            display:true,
                                            position:'right'               
                                            }   
                                        }}
                                    /> 
                                </div> 
                                <div id = {`description-div-${coin.id}`} className = "description-div"><span>{coinInfo.description}</span></div>
                                <div className = "buyselltrade-btns">
                                    <BuyCoin coin = {coin}/>
                                    <SellCoin coin = {coin}/>
                                    <TradeCoin coin = {coin}/>
                                </div>
                            </div>
                        </Collapse> 
                    </div>
                </li>

        </div>
    )
}

export default CoinData;