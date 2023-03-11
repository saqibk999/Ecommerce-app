import { getUserId } from "./getUserId";


export const GetCart = async () => {
    const userId = getUserId()
    var cart;
    
        const data = {
          userId,
        };
    
       await fetch("http://localhost:4000/cart/get-cart", {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => response.json())
          .then((result) => {
            cart = result.cart
          });
         return cart
}

