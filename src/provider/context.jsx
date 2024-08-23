import {  createContext, useContext, useEffect, useState } from "react";

import Background from "../componentes/MainGame/js/background";
import { MainGame } from "../componentes/MainGame/js/gameClass";
import Player from "../componentes/MainGame/js/Player";
import { NPC } from "../componentes/MainGame/js/Class";
// import mundo0 from "../js/colictions/colictions.json";







const GameContext = createContext({})

const npc = new NPC({ position: { x: 164, y: 164 } });

const metroid = new NPC({ position: { x: 104, y: 134 } ,
  img:"public/enemy/larvaMetroid.png",
  frameWidth: 120, frameHeight:  120, maxFrame: 4, tag:"metroid"

});

const game = new MainGame({isDev:true})



export const player = new Player({ position:{x:32,y:64}})

game.addEntity(npc)
game.addEntity(metroid)
game.addEntity(player)



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