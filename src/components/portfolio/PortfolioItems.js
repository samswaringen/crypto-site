import React, {useContext} from 'react'
import { CoinObject } from '../../App'
import Dropdown from 'react-bootstrap/Dropdown'

function PortfolioItems({ array }) {
    const coinObject = useContext(CoinObject)
    const { thumbnails } = coinObject;


    return (
        <div id = "user-portfolio">{
               array.map((item,i)=><Dropdown.Item key = {i}>{<img alt={thumbnails[item[0]]} src={thumbnails[item[0]]}></img>}{` ${item[0]}:${item[1]}`}</Dropdown.Item>) 
            }
        </div>
    )
}

export default PortfolioItems
