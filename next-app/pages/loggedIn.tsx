import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from '../Components/Header'
import { useRef, useState } from 'react'
import axios from 'axios'
import Router from 'next/router'

const LoggedIn: NextPage = () => {

    async function logout()  {
       const response = await fetch('http://localhost:4000/api/logout', {credentials: 'include'})
       const data = await response.json();
       Router.push('/');
       console.log(data);
    }

    return <div>
        <header />
        <h1>You are logged in</h1>
        <button onClick={logout}>Logga ut</button>
    </div>
}

export default LoggedIn