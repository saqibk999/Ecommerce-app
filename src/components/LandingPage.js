import React,{ useState,useEffect } from 'react'
import styles from "../cssModules/LandingPage.module.css";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import {
    Routes,
    Route
  } from "react-router-dom";
import { AllProductsComponent } from './AllProductsComponent';
import { SingleProductPage } from "./SingleProductPage";
import { CartPage } from './CartPage';
import {getUserId} from "../utils/getUserId"
import { IdPage } from './IdPage';
import ScrollToTop from '../utils/ScrollToTop';
import { OrderPage } from './OrderPage';


async function getUser(data) {    
    const res = await fetch("http://localhost:4000/user/get-by-id", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
    });
    const data1 = await res.json();
    return data1.data[0];
  }


export const LandingPage = () => {
  
   const navigate = useNavigate();
   const pull_data = (data) => {
    setUser(data)
  }

   const [user,setUser] = useState(null)
   
   const loggedIn = async(data) =>{
    const userDetails = await getUser(data).then((res)=>res).catch((e)=> e);
    setUser(userDetails.meta[0].image)
   }


   useEffect(() => {
    const userId = getUserId();
   
    if(userId){
        const data = {
            id:userId
        };
        loggedIn(data);
        }
    },[]);
   

  const goToCart = () => {
    navigate("/home/cart");
  }

  const goToId = () => {
    navigate("/home/id")
  }

  return (
    <div className={styles.body}>
    <nav className={styles.nav}>
        <strong className={styles.logo} >Bandage</strong>
        <div className={styles.icons}>
        <div>
            {user ? (
                <div>
                <img src={user} alt="dp" className={styles.image} onClick={() => goToId()}/>
                </div>
            ):(
              <div className={styles.notLogged}>
              <i className="fa fa-user" style={{marginRight:8}} ></i>
                <Link to='/login'>
                <button className={styles.loginbtn}>Login</button>
                </Link>
                </div>
            )}
        </div>
        
        <div className={styles.cartIcon}>
        <i className="fa fa-shopping-cart" onClick={() => goToCart()} ></i>
        </div>
        </div>

    </nav>
    <div className={styles.productsContainer}>
    <ScrollToTop>
    <Routes>
      <Route path="/main" element={<AllProductsComponent/>}/>
      <Route path="/product/:id" element={<SingleProductPage/>} />
      <Route path="/cart" element={<CartPage/>}/>
      <Route path="/id" element={<IdPage func={pull_data} />}/>
      <Route path="/order" element={<OrderPage/>}/>
    </Routes>
    </ScrollToTop>

    </div>
    <footer>
        <div className={styles.footerHeading}>
            <strong className={styles.footerLogo}>Bandage</strong>
            <div className={styles.socialM}>
            <i className="fa fa-facebook" style={{marginLeft:15}} ></i>
            <i className="fa fa-instagram" style={{marginLeft:15}} ></i>
            <i className="fa fa-twitter" style={{marginLeft:15}} ></i>
            </div>
        </div>
        <hr className={styles.hrLine}/>
        <div className={styles.table}>
        <table>
        <tbody>
            <tr>
                <th>Company Info</th>
                <th>Legal</th>
                <th>Features</th>
                <th>Resources</th>
            </tr>
            <tr>
                <td>Alfreds Futterkiste</td>
                <td>Maria Anders</td>
                <td>Germany</td>
                <td>India</td>
            </tr>
            <tr>
                <td>Centro comercial</td>
                <td>Francisco Chang</td>
                <td>Mexico</td>
                <td>India</td>
            </tr>
            <tr>
                <td>Ios & Android</td>
                <td>Watch a Demo</td>
                <td>Customers</td>
                <td>API</td>
            </tr>
            </tbody>
            </table>
            </div>
            <br/>
            <br/>
            <br/>
            <strong>Made with love by Saqib Khan</strong>
    </footer>
    </div>
  )
}
