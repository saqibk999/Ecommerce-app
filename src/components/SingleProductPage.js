import { useState,useEffect } from 'react'
import styles from "../cssModules/SingleProductPage.module.css";
import {
    useParams
  } from "react-router-dom";
import {getUserId} from "../utils/getUserId"
import { useNavigate } from "react-router-dom";
import { GetCart } from '../utils/GetCart';




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


export const SingleProductPage = () => {
    const [product, setProduct] = useState(null);
    const [cart,setCart] = useState([]);
    const [image, setImage] = useState(null);
    const [text,setText] = useState("Add");
    const [cls,setCls] = useState("addbtn");


    let { id } = useParams();

    useEffect(() => {
      (async () => {
      await GetCart().then((res)=>{
        setCart(res);
        return res});
    })();
    },[]);

    const navigate = useNavigate();
    const goToHome = () => {
        navigate("/home/main");
      }
    
    const url = "http://localhost:4000/product/"+id
    useEffect(() => {
        fetch(url)
          .then((response) => response.json())
          .then((result) => {
            setProduct(result.product[0]);
            setImage(result.product[0].images[0])    
            })
      },[url]);


      function checkIfInCart(product){
        let res=false
        if(cart && product){
          cart.forEach((item) => {
            if(item.id === product.id){
              res = true;
            } 
          })
        }
        return res;
      };

    const state = checkIfInCart(product)
    useEffect(() =>{
        if(state===true){
          setText("Remove")
          setCls("removebtn")
        }
    },[state])

      const handleSetImage = (event, img) => {
            setImage(img)
      }

    

    const handleButtonClick = async(event,item) => {
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


      let productList = <div>Loading</div>
      if(product){
      let images = product.images.map((img,ind) => <div key={ind}><img src={img} alt="NA" className={styles.mini}
      onClick={(event) => handleSetImage(event,img)}
      /></div>);
      productList = 
     <div key={product.id} className={styles.product} >
        <div className={styles.imageSection}>
      <div>
     <img src={image} alt="img" className={styles.image} />
     </div>
     <div className={styles.miniImgs}>
        {images}
     </div>
     </div>
     <div className={styles.details}>
     <div className={styles.name} >{product.name}</div>
     <div className={styles.category}>{product.category}</div>
     <div className={styles.price}>${product.price}</div>
     <div><strong className={styles.avaibility}>Avaibility :</strong> <strong className={styles.stock}>In Stock</strong></div>
     <div className={styles.description}>{product.meta.description}</div>
     <hr/>
     <div className={styles.bottomBtns}>
     <button className={cls}  onClick={(event) => handleButtonClick(event,product)}>{text}</button>
     <i className="fa fa-heart-o" aria-hidden="true"></i>
     <i className="fa fa-eye" aria-hidden="true" style={{marginLeft:15}} ></i> 
     <i className="fa fa-shopping-cart" style={{marginLeft:15}}></i>
     </div>
     </div>
     </div>;
      }

  return (
    <>
    <div className={styles.main_container}>
    <div className={styles.homebtn}>
    <strong onClick={() => goToHome() } >Home</strong>
    <div><i className="fa fa-chevron-right" style={{marginLeft:15}}></i> Shop</div>
    </div>
    <div className={styles.list_container}>
    {productList} 
    </div> 
    </div> 
    </>
  )
}
