import React, {useState, useEffect} from 'react'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FetchData from './components/coinlist/FetchData';
import axios from 'axios'
import useInterval from './hooks/useInterval'
import Homepage from './components/home/Homepage';
import SignIn from './components/signin/SignIn';
import SignUp from './components/signup/SignUp';
import Chats from './components/chats/Chats';
import Profile from './components/profile/Profile';
import Navbar from './components/Navbar'
import Forum from './components/messaging/Forum'
import Post from './components/messaging/Post'
import ListofGroups from './components/messaging/ListofGroups'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Logout from './components/logout/Logout';
import { ApolloProvider } from '@apollo/client'
import { client } from "./ApolloClient/client"
import Dropdown from 'react-bootstrap/Dropdown'
import PortfolioItems from './components/portfolio/PortfolioItems';



export const CoinObject = React.createContext()

let initialOrder = {
  rank:'none',
  coinname: 'none',
  price: 'none',
  totalmarketcap: 'none',
  dominance: 'none',
  supply: 'none',
  maxsupply: 'none',
  change24: 'none'
}


const totalDataObj = {};
const nameArr = [];

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeComp, setActiveComp] = useState('Home');
  const [coinData, setCoinData] = useState([]);
  const [totalVal, setTotalVal] = useState(0)
  const [sortParam, setSortParam] = useState('rank')
  const [userList, setUserList] = useState({})
  const [emailList, setEmailList] = useState({})
  const [activeUser, setActiveUser] = useState({});
  const [sortOrder, setSortOrder] = useState(initialOrder)
  const [thumbnails, setThumbnails] = useState({})
  const [portfolioValue, setPortfolioValue] = useState(0)
  const [coinChosen, setCoinChosen] = useState('')
  const [postList, setPostList] = useState()
  const [postChosen, setPostChosen] = useState({})
  const [listOfForums, setListOfForums] = useState([])
  const [goBack, setGoBack] = useState(false)
  const [forumChosen, setForumChosen] = useState({})

  const getCoinName = async()=>{
    let reqData = await axios(`https://api.coincap.io/v2/assets/`)
    let coinFetch = [...reqData.data.data];
    handleSortParam(coinFetch, sortParam) 
  }

  const getUsers = async()=>{
    console.log("get users called")
    let userData = await axios(`http://localhost:5000/users`)
    let userFetch = [...userData.data]
    handleUsers(userFetch);
  }

  const getCoinTumbnails= async()=>{
    let thumbnailData = await axios(`http://localhost:5000/thumbnails`)
    let thumbnailURLs = thumbnailData.data[0]
    if(Object.keys(thumbnailURLs).length > 0){
      setThumbnails(thumbnailURLs)
    }
  }

  useEffect(()=>{
    if(loggedIn){
      const getPortfolioValue = ()=>{
        let total = 0;
        activeUser.coinArr.map(item=>{
          let coin = coinData.filter(thing=> thing.id === item.id)
          let price = Number(coin[0].priceUsd)
          let quantity = Number(item.amount)
          console.log('price and amount', price, quantity)
          total += price*quantity
          return total
        })
        setPortfolioValue(Number(total))
      }
      getPortfolioValue()
    }
  },[coinData])

  useEffect(()=>{
    const genDataArr = ()=>{
      const dataArr = [];
      const pushData = ()=>{
          coinData.map((item)=>{
              dataArr.splice(item.rank-1,1,[item.id, Number(item.priceUsd)]);
              if(!totalDataObj[item.id]){
                  totalDataObj[item.id] = {rank:Number(item.rank),price:[]};
              }
              });
          dataArr.map((item)=>{
              let len = totalDataObj[item[0]].price.length;
              if(item[1] !== totalDataObj[item[0]].price[len-1]){
              totalDataObj[item[0]].price.push(item[1]);
              }
          nameArr.splice(len-1,1,len)
          })       
        };       
      pushData();
    }
  genDataArr();
  },[coinData]);

  const handleSort = (prop)=>{
    let newParam = prop;
        switch(sortOrder[newParam]){
            case 'none':
                setSortOrder(sortOrder, sortOrder[sortParam] = 'none');
                document.getElementById(`${sortParam}-title`).classList.remove('bolder')
                setSortOrder(sortOrder, sortOrder[newParam] = 'down');
                document.getElementById(`${newParam}-title`).classList.add('bolder')
                break;
            case 'down':
                setSortOrder(sortOrder, sortOrder[sortParam] = 'none');
                document.getElementById(`${sortParam}-title`).classList.remove('bolder')
                setSortOrder(sortOrder, sortOrder[newParam] = 'up');
                document.getElementById(`${newParam}-title`).classList.add('bolder')
                break;
            case 'up':
                setSortOrder(sortOrder, sortOrder[sortParam] = 'none');
                document.getElementById(`${sortParam}-title`).classList.remove('bolder')
                setSortOrder(sortOrder, sortOrder[newParam] = 'none');
                document.getElementById(`${newParam}-title`).classList.add('bolder')
                break;
            default:
                setSortOrder(initialOrder);
    }
    setSortParam (newParam);
    handleSortParam(coinData,newParam)
}

const handleUsers = (arr)=>{
  arr.forEach((item)=>{
    let obj = {id: item.id, email:item.email, password:item.password, name:item.name, capital:item.capital, username:item.username, coins:item.coins, coinArr: item.coins}
    setUserList(userList, userList[item.username] = obj)
    setEmailList(emailList, emailList[item.email] = {username:item.username})
  })
  console.log("handle users called", userList)
}

const handleSortParam = (array, param)=>{  
    let sortedData = [...array];
    switch(param){
     case 'coinname':
         switch(sortOrder[param]){
            case 'none':
            case 'down':
                sortedData.sort((a, b) => (a.name > b.name) ? 1 : -1);
                break;
            case 'up':
                sortedData.sort((a, b) => (b.name > a.name) ? 1 : -1);
                break;
            default:
                console.log('not working');
         }       
        break;
     case 'totalmarketcap': 
     case 'dominance':
     case 'rank':
        switch(sortOrder[param]){
            case 'none':
            case 'down':
                sortedData.sort((a, b) => (Number(a.rank) > Number(b.rank)) ? 1 : -1);
                break;  
            case 'up':
                sortedData.sort((a, b) => (Number(b.rank) > Number(a.rank)) ? 1 : -1);
                break;
            default:
                  console.log('not working');  
        }  
       break; 
     case 'price':
        switch(sortOrder[param]){
            case 'none':
            case 'down':
                sortedData.sort((a, b) => (Number(b.priceUsd) > Number(a.priceUsd)) ? 1 : -1);
                break;  
            case 'up':
                sortedData.sort((a, b) => (Number(a.priceUsd) > Number(b.priceUsd)) ? 1 : -1);
                break; 
            default:
                console.log('not working');
        }  
       break; 
     case 'supply':
        switch(sortOrder[param]){
            case 'none':
            case 'down':
                sortedData.sort((a, b) => (Number(b.supply)) > Number(a.supply) ? 1 : -1); 
                break;   
            case 'up':
                sortedData.sort((a, b) => (Number(a.supply)) > Number(b.supply) ? 1 : -1); 
                break;
            default:
                console.log('not working');  
        }  
       break;  
     case 'maxsupply':
        switch(sortOrder[param]){
            case 'none':
            case 'down':
                sortedData.sort((a, b) => (Number(b.maxSupply) > Number(a.maxSupply)) ? 1 : -1); 
                break;   
            case 'up':
                sortedData.sort((a, b) => (Number(a.maxSupply) > Number(b.maxSupply)) ? 1 : -1); 
                break;
            default:
                console.log('not working');   
        }  
       break;      
     case 'change24':
        switch(sortOrder[param]){
            case 'none':
            case 'down':
                sortedData.sort((a, b) => (Number(b.changePercent24Hr) > Number(a.changePercent24Hr)) ? 1 : -1);
                break;   
            case 'up':
                sortedData.sort((a, b) => (Number(a.changePercent24Hr) > Number(b.changePercent24Hr)) ? 1 : -1);
                break;
            default:
                console.log('not working');   
        }  
       break;        
     default:
          console.log('not working');
     }
    setCoinData(sortedData);
    }

  useEffect(() => {
    getCoinName(); 
    getUsers();
    getCoinTumbnails()
  }, [])

  useInterval(()=>{
    getCoinName();
  }, 15000)

  useInterval (()=>{
    getUsers();
  }, 60000)

  return ( 
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
        <CoinObject.Provider value = {{
            loggedIn:loggedIn,
            setLoggedIn: setLoggedIn,
            coinData:coinData, 
            coins:thumbnails, 
            setCoinData:setCoinData,
            totalVal:totalVal, 
            setTotalVal:setTotalVal, 
            handleSort:handleSort, 
            sortOrder:sortOrder, 
            totalDataObj:totalDataObj,
            nameArr:nameArr,
            userList:userList,
            setUserList:setUserList,
            emailList:emailList,
            setEmailList:setEmailList,
            activeUser:activeUser,
            setActiveUser:setActiveUser,
            activeComp:activeComp,
            setActiveComp:setActiveComp,
            getUsers:getUsers,
            handleUsers:handleUsers,
            getCoinName:getCoinName,
            thumbnails:thumbnails,
            coinChosen:coinChosen,
            setCoinChosen:setCoinChosen,
            postList:postList,
            setPostList:setPostList,
            postChosen:postChosen,
            setPostChosen:setPostChosen,
            listOfForums: listOfForums,
            setListOfForums: setListOfForums,
            forumChosen:forumChosen,
            setForumChosen:setForumChosen,
            goBack:goBack,
            setGoBack:setGoBack
            }}>
            <div id = "title-div">
              <h1>Block Talk</h1>
              <h2>Top 100 CryptoCurrencies</h2>
              <div id = "total-market-cap">Total Market Val: ${totalVal.toLocaleString('en-US')}</div><div>{`Total Number of Users: ${Object.keys(userList).length}`}</div>  
              {loggedIn && activeUser !== "" &&
                <div id="activeUser-div">
                  <div>
                  <div>{activeUser.username}</div>
                  <div>Funds Available: ${Number(activeUser.capital).toFixed(2)}</div>
                  <div>Portfolio Value: ${(portfolioValue).toFixed(2)}</div>
                  <Dropdown>
                    <Dropdown.Toggle>
                      Portfolio
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <PortfolioItems array={activeUser.coinArr} />
                    </Dropdown.Menu>
                  </Dropdown>
                  </div>
                </div>}                 
            </div>
          
          <Navbar />
          <div id ="component-div">
            <Route exact path="">
              <Redirect to="/components/home/Homepage" />
            </Route>
            <Route exact path="/">
              <Redirect to="/components/home/Homepage" />
            </Route>
            <Route path='/components/home/Homepage'>
              <Homepage />
            </Route>
            <Route path='/components/coinlist/FetchData'>
              <FetchData />
            </Route>
            <Route path='/components/chats/Chats'>
              <Chats />
            </Route>
            <Route path='/components/profile/Profile'>
              <Profile />
            </Route>
            <Route path='/components/signin/SignIn'>
              <SignIn />
            </Route>
            <Route path='/components/signup/SignUp'>
              <SignUp />
            </Route>
            <Route path='/components/logout/Logout'>
              <Logout />
            </Route>
            <Route path="/components/messaging/ListofGroups">
              <ListofGroups />
            </Route >
            <Route path="/components/messaging/Forum">
              <Forum />
            </Route>
            <Route path="/components/messaging/Post">
              <Post />
            </Route>
          </div>
        </CoinObject.Provider>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
