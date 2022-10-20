import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from '../Components/Header'
import { useState } from 'react'
import axios from 'axios'


const Home: NextPage = () => {

  const [isLogin, setIsLogin] = useState<boolean>(true)




  return <div className={styles.home}>
    <Header />

  <input type="text" placeholder="Email" required></input>
  <input type="password" placeholder="Lösenord" required></input>
    <button className='logIn'>Logga in</button>

    {/* <button className='register' onClick={() => setIsLogin(false)}>Registrera ny användare</button> */}
    <button className='register' onClick={async () => {
      setIsLogin(false)

    }}>Registrera ny användare</button>


    <div style={{
      color: "red"
    }}>
      {isLogin ? <div> 
        <input type="email" placeholder="email" required></input> 
        <input type="password" placeholder="Lösenord" required></input>
        </div> :<div>
          <input type="text" placeholder="Användarnamn" required></input>
          <input type="password" placeholder="Lösenord" required></input>
          <input type="email" placeholder="email" required></input>

          <button className='register' onClick={() => setIsLogin(true)}>Registrera</button></div>}
    </div>

  </div>


};

export default Home;
