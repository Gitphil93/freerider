import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from '../Components/Header'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Router from 'next/router'
import Link from 'next/link'

const LoggedIn: NextPage = () => {

    const [User, setUser] = useState<object>({}) //innehåller datan i våran token 


    //Skyddar routes, man kan inte logga in via URL'en. Skickas till servern / backend.
    useEffect(() => {

        async function isLoggedIn() {
            const response = await fetch('http://localhost:4000/api/loggedin', {
                credentials: 'include'
            });
            const data = await response.json();

            console.log(data);

            if (data.loggedIn == false) {
                Router.push('/')
            }
            setUser(data.data); //detta sparar våra roller
        }

        isLoggedIn();

    }, [])

    async function logout() {
        const response = await fetch('http://localhost:4000/api/logout', { credentials: 'include' })
        const data = await response.json();
        Router.push('/');
        console.log(data);
    }

    return <div>
        <header />
        <h1>You are logged in {User.email}</h1>
        <button onClick={logout}>Logga ut</button>
        {User.roles?.includes('SuperAdmin') ? (
            <Link href={'/superAdmin'}>
                <a>Super Admin</a>
            </Link>
        ) : ''}

    </div>
}

export default LoggedIn

