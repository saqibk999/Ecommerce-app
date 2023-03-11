import React from 'react'
import { useNavigate } from "react-router-dom";
import { useState ,useEffect} from 'react'
import {getUserId} from "../utils/getUserId"
import Cookies from 'universal-cookie'
import styles from "../cssModules/IdPage.module.css";




    async function getUser(data) {
        
        const res = await fetch("http://localhost:4000/user/get-by-id", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        });
        const data1 = await res.json();
        return data1.data[0];
    }

export const IdPage = (props) => {

    const [user,setUser] = useState(null)
    const navigate = useNavigate();
    const cookies = new Cookies();


    const goToHome = () => {
        navigate("/home/main");
      }

    const loggedIn = async(data) =>{
    const userDetails = await getUser(data).then((res)=>res).catch((e)=> e);
    setUser(userDetails)
    }

    const logout = () => {
        setUser(null);
        cookies.remove("jwt-authorization",{path: "/home", domain: "localhost"})
        props.func(null)
        navigate("/home/main");
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


  return (
    <>
    <div className={styles.mainContainer}>
     <div className={styles.homebtn}>
          <strong onClick={() => goToHome()}>Home</strong>
          <div className={styles.head}>
            <i className="fa fa-chevron-right" style={{marginLeft:15}}></i>Profile
          </div>
        </div>
        {user ? (
            <div className={styles.profile}>
            <div >
                <img src={user.meta[0].image} alt="dp" className={styles.image}/>
            </div>
            <div className={styles.details}>
                <strong className={styles.name}>{user.firstName+" "+user.lastName}</strong>
                <strong className={styles.email}>{user.email}</strong>
                <strong className={styles.phone}>{user.phone}</strong>
                <div className={styles.btns}>
                <button className={styles.editbtn}>Edit Profile</button>
                <button onClick={() => logout()} className={styles.logoutbtn}>Logout</button>
                </div>
            </div>
        </div>
        ):(
            <div className={styles.notlogged}> 
            <strong>Please Login</strong>
            </div>
        )}
        

    </div>
    </>
  )
}
