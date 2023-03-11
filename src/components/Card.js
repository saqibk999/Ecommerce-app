import React, { useEffect,useState } from 'react'
import styles from "../cssModules/Card.module.css";
import { useNavigate } from "react-router-dom";
import {getUserId} from "../utils/getUserId";

async function postIntoCart(data) {
    const res = await fetch("http://localhost:4000/cart/add-to-cart", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    
    const data1 = await res.json();
    console.log(data1)
    return data1;
  }

  async function deleteFromCart(data) {
    const res = await fetch("http://localhost:4000/cart/delete-product", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
  
    const data1 = await res.json();
    console.log(data1);
    return data1;
  }

export const Card = (props) => {
    const item = props.product
    const cart = props.cartItems

    const [text,setText] = useState("Add")
    const [cls,setCls] = useState("addbtn");

    const navigate = useNavigate();

    function checkIfInCart(product){
        let res=false
        if(cart && product){
          cart.forEach((item,ind) => {
            if(item.id === product.id){
              res = true;
            } 
          })
        }
        return res;
      };

    const state = checkIfInCart(item)
    useEffect(() =>{
      if(state===true){
        setText("Remove")
        setCls("removebtn")
      }
    },[state])



    const handlePoductClick = (item) =>{
        const id= item.id;
        navigate('/home/product/'+id)
      }

      const handleButtonClick = async(event,item) => {
        event.stopPropagation()
        const userId = getUserId();
        if(!userId){
            alert("Please login to add products!")
            return;
        }
        if(text==="Add"){
        console.log("itemId= "+item.id);
            const data={
                userId,
                productId:item.id,
                amount:item.price,
            }
            const result= await postIntoCart(data).then((res)=>res.status);
            if(result === 'success'){
              setCls("removebtn")
              setText("Remove")   
           }
      }
      if(text ==="Remove"){
        const data = {
            userId,
            productId: item.id,
          };
          const result = await deleteFromCart(data).then((res) => res.status);
          if (result === "success") {
            console.log("deleted from cart");
              setCls("addbtn")
              setText("Add")
          }
      }
    }

  return (
    <div className={styles.product} onClick={() => handlePoductClick(item)}>
      <img src={item.images[0]} alt="img" className={styles.image}/>
     <div className={styles.name}>{item.name}</div>
     <div className={styles.category}>{item.category}</div>
     <div className={styles.price}>${item.price}</div>
     <button className={cls} onClick={(event) => handleButtonClick(event,item)}>{text}</button>
     </div>
  )
}

