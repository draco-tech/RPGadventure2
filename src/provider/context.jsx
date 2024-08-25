import {  createContext, useContext, useEffect, useState } from "react";

import Background from "../componentes/MainGame/js/background";
import { MainGame } from "../componentes/MainGame/js/gameClass";
import Player from "../componentes/MainGame/js/Player";
import { NPC } from "../componentes/MainGame/js/Class";
import { Pokemon } from "../componentes/MainGame/js/pokemon/Pokemon";

// import mundo0 from "../js/colictions/colictions.json";
 export const ramdomePosition = () => {
  return {x: Math.floor(Math.random() * 60) * 32, 
           y: Math.floor(Math.random() * 40) * 32
          }
}

const bulbasaur =   {position: ramdomePosition(),allimages:["001","002","003"], tag:"bulbasaur"}
const charmander =  {position: ramdomePosition(),allimages:["004","005","006"], tag:"charmander"}
const squirtle =    {position: ramdomePosition(),allimages:["007","008","009"], tag:"squirtle"}
const caterpie =    {position: ramdomePosition(),allimages:["010","011","012"], tag:"caterpie"}
const weedler =     {position: ramdomePosition(),allimages:["013","014","015"], tag:"weedler"}
const pidgey =      {position: ramdomePosition(),allimages:["016","017","018"], tag:"pidgey"}
const ratata =      {position: ramdomePosition(),allimages:["019","020"], tag:"ratata"}
const spearow =     {position: ramdomePosition(),allimages:["021","022"], tag:"spearow"}
const ekans =       {position: ramdomePosition(),allimages:["023","024"], tag:"ekans"}
const pikachu =     {position:ramdomePosition(),allimages:["025","026"], tag:"pikachu"}

const GameContext = createContext({})

const metroidStup = {
  position: { x:  64, y: 134 },
  img:"public/enemy/larvaMetroid.png",
  frameWidth: 120, frameHeight:  120, maxFrame: 4, tag:"metroid"
}


// const charizard = new Pokemon({
//   allimages:bulbasaur
// })


export const player = new Player({ position:{x:32,y:64}})


const allEntentys =  [
  

  player,
  new Pokemon(bulbasaur),
  new Pokemon(charmander),
  new Pokemon(squirtle),
  new Pokemon(caterpie),
  new Pokemon(weedler),
  new Pokemon(pidgey),
  new Pokemon(ratata),
  new Pokemon(spearow),
  new Pokemon(ekans),
  new Pokemon(pikachu),
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