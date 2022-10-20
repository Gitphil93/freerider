import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from '../Components/Header'
import { useRef, useState } from 'react'
import axios from 'axios'

const LoggedIn: NextPage = () => {

    return <div>
        <header />
        <h1> You are logged in </h1>
    </div>
}

export default LoggedIn