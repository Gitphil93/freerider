import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from '../Components/Header'
import { useRef, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'


const Home: NextPage = () => {

  const [isLogin, setIsLogin] = useState<boolean>(true)

  //här sparar vi från html inputs, registrera användare. Dessa skrivs ut i inputfälten nedan. 
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordRepeat, setPasswordRepeat] = useState("")

  const router = useRouter()

  //loggar in på konto kopplad till button
  async function login() {
    console.log("login", email, password)
    const response = await fetch("http://localhost:4000/api/login", { //hit kommer result från index.js api/login
      method: "POST", 
      credentials: 'include',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email, password: password
      })
    })
    const data = response.status //från api/login funktion se ovan. 
    const User = await response.json()
    console.log(User)
    console.log(data) //detta kommer från backend index.js 200 eller 404 error

    if (data == 200) {  //Om allt gick bra och inte fick 404/error så är kontot skapat.
      alert("Du är inloggad!")
      router.push("/loggedIn")
    }
  }

  //reggar konto kopplad till button
  async function register() {
    console.log("register", email, password, passwordRepeat)
    if (password == passwordRepeat) {
      console.log("godkänt")
      //Här skickar vi ny regg av användare till api/databasen index.js
      const response = await fetch("http://localhost:4000/api/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email, password: password
        })
      })
      const data = response.status
      console.log(data) //detta kommer från backend index.js 200 eller 404 error

      if (data == 200) {  //Om allt gick bra och inte fick 404/error så är kontot skapat.
        alert("användare skapad, vänligen logga in")
      }

    } else {
      alert("Lösenord matchade ej varandra")
    }
  }

  return <div className={styles.home}>
    <Header />

    <button className='logIn' onClick={async () => { setIsLogin(true) }}>Logga in</button>
    <button className='register' onClick={async () => { setIsLogin(false) }}>Registrera ny användare</button>


    <input type="email" placeholder="email" required value={email} onChange={e => setEmail(e.target.value)}></input>
    <input type="password" placeholder="Lösenord" required value={password} onChange={e => setPassword(e.target.value)}></input>
    {isLogin ? (
      <button className='login' onClick={login}>Logga in</button>
    ) : (
      <>
        <input type="password" placeholder='Upprepa lösenord' required value={passwordRepeat} onChange={e => setPasswordRepeat(e.target.value)}></input>
        <button className='register' onClick={() => { setIsLogin(true); register() }}>Registrera</button>
      </>
    )}
  </div>
};

export default Home;
