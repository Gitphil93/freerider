import Router from 'next/router'
import type { NextPage } from 'next'
import { useEffect } from 'react'
import { useRef, useState } from 'react'


const superAdmin: NextPage = () => {

    const [allUsers, setAllUsers] = useState<Array<object>>([])

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

        async function getAllUsers() {
            const response = await fetch('http://localhost:4000/api/getAllUsers', {
                credentials: 'include'
            });
            const data = await response.json();

            setAllUsers(data);
        }

        getAllUsers();

    }, [])

    return (
        <div>
            <h1>Super Admin </h1>
            <ul>
                {allUsers.map((User) => {
                    return <li key={User.userId}>
                        <p>{User.userId}</p>
                        <p>{User.email}</p>
                    </li>
                })}
            </ul>
        </div>
    )
}




export default superAdmin;