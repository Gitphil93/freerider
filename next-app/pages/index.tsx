import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  
  return <div className={styles.home}><h1>Freerider</h1>

  <input type="text" placeholder="Användarnamn" required></input>
  <input type="password" placeholder="Lösenord" required></input>
    <button>Logga in</button>

  <button>Registrera ny användare</button>



  </div>


};
    
export default Home;
