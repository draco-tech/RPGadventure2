import {  createContext, useContext, useEffect, useState } from "react";
import Player from "../componentes/MainGame/js/Class";
import Background from "../componentes/MainGame/js/background";
// import mundo0 from "../js/colictions/colictions.json";
import mundo0 from "../tiled/mapaGia.json";
import mundo2 from "../tiled/mapaGia2.json";
import mundo3 from "../tiled/mapaGia3.json";






const GameContext = createContext({})



const allWords = [
  new Background({playerPosition:{x:32,y:64},resourse:mundo0} ),
  new Background({playerPosition:{x:122,y:64},resourse:mundo2} ),
  new Background({playerPosition:{x:32,y:364},resourse:mundo3} ),  

]

console.log('allWords',allWords);




export const GameContextProvider = ({children})=>{
 const [isDev, setIsDev] = useState(false)
 const [mundoIndex, setMundoIndex] = useState(2)


 const mundo = allWords[mundoIndex]  //new Background({resourse:mundo0} )

 const player = new Player({ position:{x:32,y:64},mundo})

 const changeMundo = ()=>{
  if(mundoIndex + 1 > allWords.length - 1){
    setMundoIndex(0)
  }else{
    setMundoIndex(mundoIndex + 1)
  }
  

  player.mundo = allWords[mundoIndex]
  console.log('changeMundo',allWords[mundoIndex]);
  
 }
 
 useEffect(()=>{
  player.isDev = isDev


  player.speed =  isDev ? 5 : 2

  
 },[isDev])

  
  const value  = {
    hola:"jjja",
    player,
    mundo,
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