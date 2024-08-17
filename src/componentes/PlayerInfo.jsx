import CardContainer from "./CardContainer";
import EXPbar from "./EXPbar";

const PlayerInfo =()=>{

  const allImge = ['/axe.png' , '/mage.png','/sword.png',``]

  return(
    <CardContainer extraClass="PlayerInfo">
      <div className="imagene">
        {
          allImge.map((imagenes)=> <ShowImagen img={imagenes}/>)
        }
      </div>
      <div>
        <div className="atributes-info">
          <p>HP: 100</p>
          <p>Mana: 100</p>
          <p>Attack: 100</p>
          <p>Defence: 100</p>
          <p>Speed: 100</p>
          </div>
      <EXPbar/>  
      </div>
      </CardContainer>
    )
};

export default PlayerInfo; 


const ShowImagen= ({img})=>{
  return(
    <div id="imagen">
      <img src={img} alt="" />
    </div>
  )
}