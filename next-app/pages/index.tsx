import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from '../Components/Header'


const Home: NextPage = () => {
  
  return <div className={styles.home}>
    <Header />

  <input type="text" placeholder="Användarnamn" required></input>
  <input type="password" placeholder="Lösenord" required></input>
    <button className='logIn'>Logga in</button>

  <button className='register'>Registrera ny användare</button>



  </div>


};
    
export default Home;
