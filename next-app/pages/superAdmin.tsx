import Router from 'next/router'
import type { NextPage } from 'next'
import { useEffect } from 'react'
import { useRef, useState } from 'react'
import { stringify } from 'querystring'


type User = {
    userId: number,
    email: string,
  }

const SuperAdmin: NextPage = () => {

    const [allUsers, setAllUsers] = useState<User[]>([])

    async function getAllUsers() {
        const response = await fetch('http://localhost:4000/api/getAllUsers', {
            credentials: 'include'
        });
        const data = await response.json();

        if(!data.message){
            setAllUsers(data);
        }

    }

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

       
        getAllUsers();

    }, [])

// ta bort användare/users + delete button

    async function deleteUser(userId) {
        console.log(userId);
        const response = await fetch('http://localhost:4000/api/deleteUser', {  //länkas till databasen för att ta bort users
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId})
        })
        const data = await response.json();
        console.log(data) 
        if (data.message == 'DELETED USER'){
            getAllUsers();
        }
    }

    return (
        <div>
            <h1>Super Admin </h1>
            <ul>
                {allUsers?.map((User) => {
                    return <li key={User.userId}>
                        <p>{User.userId}</p>
                        <p>{User.email}</p>
                        <button onClick={() => {
                            deleteUser(User.userId)
                        }}>Delete User</button>
                    </li>
                })}
            </ul>
        </div>
            )
}




export default SuperAdmin;