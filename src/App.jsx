
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
  const { changeMundo ,setIsDev , isDev} = useGameContext() 
  return(
    <div>

<p
          onClick={changeMundo}
          >nextworld</p>

      {swicht ?
        <div
        onClick={()=>{setSwicht(!swicht) }}
        className='absolute top-0 left-0 w-screen h-screen flex justify-center py-5 bg-[#4c465450] '
        >
        
    
         <div className=' bg-[#4c4654] rounded-[16px] border-[6px] border-[#a296c9] relative shadow-lg w-[300px] h-[300px] flex justify-center pt-12'>
          <p 
          onClick={()=>{setIsDev(!isDev) }}
          >Activar devMode : {isDev.toString()} </p>
          
         </div>
    
        </div> :
        <div
        onClick={()=>{setSwicht(!swicht) }}
        className='absolute top-0 left-0 w-[50px] h-[50px] flex justify-center py-5 bg-red-500 '
        >
        
    
          <p 
          
          >menu  </p>
       
    
        </div>
      }
    
    
    
    
    
    </div>
  
  )
}









