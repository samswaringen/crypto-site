import React, { useState, useEffect, useContext } from 'react'
import { CoinObject } from '../../App'
import MapCoinNames from './MapCoinNames'
import axios from 'axios'
import './message.css'
import { useQuery, useLazyQuery, gql } from "@apollo/client";

function ListofGroups() {
    const coinObject = useContext(CoinObject);
    const {coinData, setListOfForums, listOfForums} = coinObject;
    const [coinNames, setCoinNames] = useState([])

    const nameArr = [];

    const GET_FORUMS = gql`
    query getForums {
        forums {
            id,
            name
        }
    }
    `;

    const { loading, error, data } = useQuery(GET_FORUMS);
    useEffect(()=>{
        console.log('gql loading...')
        !loading && setListOfForums(JSON.parse(JSON.stringify(data.forums)))
    },[data])

    console.log("list",listOfForums)
    useEffect(()=>{
        coinData.map((coin)=>{
            let name = coin.id;
            nameArr.push(name)
            setCoinNames([...nameArr]);
        })
    },[])
       
    return (
        <div id = "forum-div">
            <MapCoinNames names = {coinNames} />
        </div>
    )
}

export default ListofGroups
