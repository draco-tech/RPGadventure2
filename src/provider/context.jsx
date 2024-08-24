import {  createContext, useContext, useEffect, useState } from "react";

import Background from "../componentes/MainGame/js/background";
import { MainGame } from "../componentes/MainGame/js/gameClass";
import Player from "../componentes/MainGame/js/Player";
import { NPC } from "../componentes/MainGame/js/Class";
import { Pokemon } from "../componentes/MainGame/js/pokemon/Pokemon";

// import mundo0 from "../js/colictions/colictions.json";







const GameContext = createContext({})

const metroidStup = {
  position: { x:  64, y: 134 },
  img:"public/enemy/larvaMetroid.png",
  frameWidth: 120, frameHeight:  120, maxFrame: 4, tag:"metroid"
}


const charizard = new Pokemon({ position: { x: 164, y: 164 },
img:"public/pokemon/006.png", tag:"charizard"
})


export const player = new Player({ position:{x:32,y:64}})


const allEntentys =  [
  

  player,
  charizard,
  // new NPC(
  // metroidStup
  // ),

]

const game = new MainGame({isDev:true})


allEntentys.forEach(entity =>{
  game.addEntity(entity)
})






export const GameContextProvider = ({children})=>{
 const [isDev, setIsDev] = useState(true)




 

 const changeMundo = ()=>{

 
  
 }
 
 useEffect(()=>{
  game.isDev = isDev


  player.speed =  isDev ? 5 : 2

  
 },[isDev])

  
  const value  = {
    hola:"jjja",
    player,
    game,
    setIsDev,isDev ,changeMundo

    

  }
  return(
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

const useGameContext = () => useContext(GameContext)

export default useGameContext