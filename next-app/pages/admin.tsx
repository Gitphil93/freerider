import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Router from 'next/router';
import { useEffect } from 'react';
import styles from '../styles/Home.module.css'

const Admin: NextPage = () => {

      //blockerar inlogg via URL / kollar så att du är inloggad via token.

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
        }

        isLoggedIn();

    }, [])



  return <div>Admin Page</div>
};
    
export default Admin;