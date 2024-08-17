const CardContainer =({children,extraClass})=>{

  return(
    <div class={`card-container ${extraClass}`}>
{children}
    
   </div>
    )
};

export default CardContainer; 