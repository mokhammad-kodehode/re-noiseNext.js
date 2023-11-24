"use client";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from "./styles.module.css"



export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: "",
        username: "",
    })

    const [loading, setLoading] = useState(false);

    const onSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            console.log("Signup success", response.data);
            router.push("/login");
            
        } catch (error:any) {
            console.log("Signup failed", error.message);
            
            toast.error(error.message);
        }finally {
            setLoading(false);
        }
    }



    const isFormValid = () => {
        return user.username !== '' && user.email !== '' && user.password !== '';
      };


      return (
        <div className={styles.container}>
            <h1>{loading ? "Processing" : "Signup"}</h1>
            <hr />
            <div className={styles.signup}>
                    <p className={styles.signup_new}>
                        Already have an account?
                        <Link href="/login">
                            <button className={styles.btn}>Log in</button>
                        </Link>
                    </p>
                </div>
                <div className={styles.formGroup}>
                            <label htmlFor="username">Username:</label>
                            <input
                                id="username"
                                type="text"
                                name="username"
                                value={user.username}
                                onChange={(e) => setUser({...user, username: e.target.value})}
                                placeholder="Username"
                            />
                    </div>
                    <div className={styles.formGroup}>
                            <label htmlFor="email">Email:</label>
                            <input
                                id="email"
                                type="text"
                                name="email"
                                value={user.email}
                                onChange={(e) => setUser({...user, email: e.target.value})}
                                placeholder="Email"
                            />
                    </div>
                    <div className={styles.formGroup}>
                                    <label htmlFor="password">Password:</label>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={user.password}
                                        onChange={(e) => setUser({...user, password: e.target.value})}
                                        placeholder="Password"
                                        required
                                    />
                            </div>
                            <button 
                                    className={`${styles.btn} ${isFormValid() ? '' : styles.disabled}`}
                                    onClick={onSignup}
                                    disabled={!isFormValid()}
                                    >
                                        Signup
                            </button>
            </div>
        )

}