import {  createContext, useContext, useEffect, useState } from "react";
import Player from "../componentes/MainGame/js/Class";
import Background from "../componentes/MainGame/js/background";
// import mundo0 from "../js/colictions/colictions.json";
import mundo0 from "../tiled/mund0PruebaJSons.json";




const GameContext = createContext({})
// "/img/map0.bmp" 3840 × 1920

const player = new Player({ position:{x:32,y:32}})

const mundo = new Background({position:{x:0,y:0},image:"/img/map0.bmp",resourse:mundo0} )
export const GameContextProvider = ({children})=>{
 const [isDev, setIsDev] = useState(true)
 
 useEffect(()=>{
  player.isDev = isDev


  player.speed =  isDev ? 5 : 2

  
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