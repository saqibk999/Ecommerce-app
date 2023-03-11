import { useState,useEffect } from 'react'
import { GetCart } from '../utils/GetCart';
import { Card } from './Card';

export const AllProductsComponent = () => {

    const [products, setProducts] = useState([]);
    const [cart,setCart] = useState([]);
  
    useEffect(() => {
      fetch("http://localhost:4000/product/get-list")
        .then((response) => response.json())
        .then((result) => {
          setProducts(result.products);    
          })
    },[]);

    useEffect(() => {
      (async () => {
      await GetCart().then((res)=>{
        setCart(res);
        return res});
    })();
    },[]);
      

    

    
      

      let productList = products.map((item,index) =><div key={index}>
     <div key={item.id}  >
     <Card product={item} cartItems={cart}/>
     </div>
     </div>
     );

  return (
    <>
    {productList}
    </>
  )
}
