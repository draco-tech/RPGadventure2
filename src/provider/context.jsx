import {  createContext, useContext, useEffect, useState } from "react";
import Player from "../componentes/MainGame/js/Class";
import Background from "../componentes/MainGame/js/background";


const GameContext = createContext({})


const player = new Player({ position:{x:200,y:240}})

const mundo = new Background({position:{x:0,y:0}})
export const GameContextProvider = ({children})=>{
 const [isDev, setIsDev] = useState(false)
 
 useEffect(()=>{
  player.isDev = isDev
  console.log('player',player);
  
 },[isDev])

  
  const value  = {
    hola:"jjja",
    player,
    mundo,
    setIsDev,isDev

    

  }
  return(
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

const useGameContext = () => useContext(GameContext)

export default useGameContext