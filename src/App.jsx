
import './App.css'

import CardContainer from './componentes/CardContainer'
import GameView from './componentes/MainGame/GameView'
import PlayerInfo from './componentes/PlayerInfo'
import ShowItems from './componentes/ShowItem'
import { useEffect, useRef, useState } from 'react';
import useGameContext from './provider/context'

let myBarraja = [{
  title: "Blade of Eternity",
  Image: "/sword.png"
},{
  title: "Ancient Demonic Ax",
  Image: "/axe.png"
},{
  title: "Forrest Staff",
  Image: "/mage.png"
}]


function App() {
 
  

  return (
    <div>
    {/* {swicht && <ShowItems wapon={myBarraja[0]}/>} */}
    <GameView/>
    
      <MyMenu/> 
    </div>
  )
}

export default App

const MyMenu = ()=>{
  const [swicht , setSwicht] = useState(false)
  const { player ,setIsDev} = useGameContext() 
  return(
    <div
    onClick={()=>{setSwicht(!swicht), setIsDev(state => !state) }}
    style={{width:50,height:50 , backgroundColor:"red"}}>
     {swicht ? 'lindo menu':"menu feo"}
    </div>
  )
}









