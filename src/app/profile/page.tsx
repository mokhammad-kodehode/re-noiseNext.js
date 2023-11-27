"use client";
import axios from "axios";
import Link from "next/link";
import React, {useState, useEffect} from "react";
import {toast} from "react-hot-toast";
import {useRouter} from "next/navigation";

interface User {
    _id: string;
    username: string;
  }


export default function ProfilePage() {
    const router = useRouter()
    const [username, setUsername] = useState<string | null>(null);

    const logout = async () => {
        try {
            await axios.get('/api/users/logout')
            toast.success('Logout successful')
            router.push('/login')
        } catch (error:any) {
            console.log(error.message);
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getUserDetails();
      }, []);
    
      const getUserDetails = async () => {
        try {
          const response = await axios.get('/api/users/user');
          console.log(response.data);  // Посмотрите, что возвращает сервер
          const userData: User = response.data.data;
      
          if (userData && userData.username) {
            setUsername(userData.username);
          } else {
            console.error('Invalid response format or username not found');
          }
        } catch (error:any) {
          console.error('Error fetching user details:', error.message);
        }
      };

    return (
        <div className="">
            <h1>Profile</h1>
            <hr />
            <p>Profile page</p>
            {username && <p>Username: {username}</p>}
        <hr />
        <button
        onClick={logout}
        className=""
        >Logout</button>

            </div>
    )
}