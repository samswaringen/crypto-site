import React, {useContext, useState} from 'react'
import { CoinObject } from '../../App'
import { useHistory } from 'react-router-dom';
import axios from 'axios'
import { useQuery, useLazyQuery, gql } from "@apollo/client";

function MapCoinNames({ names }) {
    const coinObject = useContext(CoinObject)
    const {coinData, setCoinChosen, listOfForums, setListOfForums, setForumChosen, forumChosen} = coinObject;


    const history = useHistory()

    const loadForum = (name)=>{
        let chosen = coinData.filter(item=> item.id === name)
        console.log("chosen",chosen[0].id)
        let index = 0;
        let id = 0;
        if(listOfForums.length>0){
            listOfForums.map((item,i)=>{
                console.log("item:",item)
                if(item.name === chosen[0].id){
                    console.log('true')
                    index = i
                    id = item.id
                    console.log("index",index)
                    console.log('id',id)
                }   
            })
        }
        if(id !== 0){
            console.log("isFound")
            var config = {
                method: 'get',
                url: `http://localhost:1337/forums/${id}`,
                headers: { }
              };
              
              axios(config)
              .then(function (response) {
                console.log("response",JSON.stringify(response.data));
                setForumChosen(response.data)
              })
              .catch(function (error) {
                console.log(error);
              });
        }else{
            let newList = {}
            newList[chosen[0].id] = {general:{},news:{},rumors:{},technology:{}}
            let jsonList = JSON.stringify(newList)
            console.log(`Wasn't Found, made`,chosen[0].id)
            setForumChosen({name: chosen[0].id, thread: jsonList})
            var data = {
                "name":`${chosen[0].id}`,
                "general": `{}`,
                "technology": `{}`,
                "rumors": `{}`,
                "news": `{}`
            };
    
            var config = {
                method: 'post',
                url: `http://localhost:1337/forums`,
                headers: { 
                        'Content-Type': 'application/json'
                },
                data : data
            };
    
            axios(config)
                .then(function (response) {
                    console.log(response.status);
                })
                .catch(function (error) {
                    console.log(error);
                });
            setListOfForums([...listOfForums,newList])
        }
        setCoinChosen(chosen[0])
        history.push(`./Forum#${chosen[0].name}`)
    }

    return (
        <div className = "coin-name-div">
            {names.map((name)=><div key={name} type = "button" className = "name-button" onClick = {()=>loadForum(name)}>{name}</div>)}
        </div>
    )

}
export default MapCoinNames
