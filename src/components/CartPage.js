import React, { useEffect, useState } from "react";
import { getUserId } from "../utils/getUserId";
import styles from "../cssModules/CartPage.module.css";
import { useNavigate } from "react-router-dom";
import { GetCart } from "../utils/GetCart";

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

async function deleteCart(data){
  const res = await fetch("http://localhost:4000/cart/delete-cart", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  const data1 = await res.json();
  console.log(data1);
  return data1
}

async function updateQuantity(data) {
    const res = await fetch("http://localhost:4000/cart/update-quantity",{
        method:"POST",
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json"}
    });
    
    const data1 = await res.json();
    console.log(data1);
    return data1;
}

async function placeOrder(data) {
  const res = await fetch("http://localhost:4000/order/place",{
        method:"POST",
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json"}
    });
    const data1 = await res.json();
    console.log(data1);
    return data1;
}

export const CartPage = ( ) => {

  const ref = React.useRef(null);

  const [vat, setVat] = useState(0)
  const [state, setState] = useState(true);
    
  const userId = getUserId();
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/home/main");
  };

  const [products, setProducts] = useState([]);
  const [orderTotal, SetOrderTotal] = useState(0);

  

  useEffect(() => {
    if(products.length===0){
      ref.current.setAttribute("disabled", "disabled");
    }
    if(products.length>0){
      ref.current.removeAttribute("disabled");
    }
  }, [products.length]);


  const getOrderTotal = (array) => {
    let sum = 0;
    array.forEach((product) => {
      sum += parseInt(product.price) * parseInt(product.quantity);
    });
    if(sum>0) setVat(10)
    return sum;
  };

  const handleChangedQuantity = async (event,item) => {
    const data ={
        userId,
        productId:item.id,
        quantity:parseInt(event.target.value)
    }
    const result = await updateQuantity(data).then((res) => res.status);
    if (result === "success") {
        console.log("updated quantity");
        setState(!state)
      }
  }

  const handleDeleteFromCart = async (event, item) => {
    const data = {
      userId,
      productId: item.id,
    };
    const result = await deleteFromCart(data).then((res) => res.status);
    if (result === "success") {
      console.log("deleted from cart");
      setProducts(products.filter((product) => product.id !== item.id));
    }
    setState(!state)
  };

  const handlePlaceOrder = async (event,total) => {
      let id =0;
       const data ={
        userId,
        amount:total
       }
       const result= await placeOrder(data).then((res)=>{
        id = res.id
        return res.status
      });
       if(result === 'success'){
        const data ={userId}
        const result2 = await deleteCart(data).then((res)=>res.status);
          if(result2 === "success"){
            setState(!state)
            navigate("/home/order",{state:{id,status:true}});
          }
          else{
            setState(!state)
            navigate("/home/order",{state:{id:null,status:false}});
          } 
       }
  }
  
  useEffect(() => {
      (async () => {
      await GetCart().then((res)=>{
        setProducts(res);
        SetOrderTotal(getOrderTotal(res));
        if(res.length===0) setVat(0)
        return res});
    })();
    }, [userId,state]);
  
  
  let productList = <div>Loading</div>;
  if (products.length) {
    productList = products.map((item, index) => (
      <div key={index}>
        <div key={item.id} className={styles.product}>
          <img src={item.images[0]} alt="img" className={styles.image} />
          <div className={styles.details}>
            <div className={styles.name}>{item.name}</div>
            <div className={styles.category}>{item.category}</div>
            <div className={styles.prices}>
            <div className={styles.price1}>${item.price}</div>
            <div className={styles.price2}>${item.price}</div>
            </div>
          <div className={styles.buttons}>
            <select name="quantity" id="qty" defaultValue={item.quantity} className={styles.quantity}
             onChange={(event) => handleChangedQuantity(event,item)}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            <button
              className={styles.removebtn}
              onClick={(event) => handleDeleteFromCart(event, item)}
            >
              Delete
            </button>
            </div>
          </div>
        </div>
      </div>
    ));
  }

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.cartContainer}>
        <div className={styles.homebtn}>
          <strong onClick={() => goToHome()}>Home</strong>
          <div className={styles.head}>
            <i className="fa fa-chevron-right" style={{marginLeft:15}}></i>MyCart
          </div>
        </div>
        {products.length ? (
          <div>{productList}</div>
        ) : (
          <div>Please add some products to cart</div>
        )}
        </div>
        <div className={styles.orderContainer}>
          <h3 className={styles.highlight}>Order Summary</h3>
          <div className={styles.discountContainer}>
            <span style={{color:"grey"}}>Discount code:</span>
            <div className={styles.discount}>
                <input placeholder="SAVE20" className={styles.codeInput}/>
                <button className={styles.applybtn} >Apply</button>
            </div>
          </div>
          <div className={styles.orderDetails}>
            <div className={styles.orderData}>
            <span>Order Value</span>
            <span>${orderTotal}</span>
            </div>
            <div className={styles.orderData}>
                <span>VAT</span>
                <span>${vat}</span>
            </div>
            <div className={styles.orderData}>
                <span>Total before discount</span>
                <span>${orderTotal + vat}</span>
            </div>
            <div className={styles.orderData} >
                <span className={styles.highlight}>TOTAL</span>
                <span className={styles.highlight}>${orderTotal + vat}</span>
            </div>
          </div>
          <button className={styles.placeOrderBtn} onClick={(event) => handlePlaceOrder(event,orderTotal+vat)}
           ref={ref}
          >Place Order</button>
          <span className={styles.notice}>
            *Custom orders need a few working days to be created. More info here
          </span>
        </div>
      </div>
    </>
  );
};
