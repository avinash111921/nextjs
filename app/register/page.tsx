"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const registerPage = () => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(password !== confirmPassword){
            alert("Password and Confirm Password do not match");
            return;
        }
        try {
            //react query - > loading state error debouncing 
            const response = await fetch("/api/register",{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({email,password})
            })
            const data = await response.json();
            if(data.error){
                alert(data.error);
                return;
            }
            console.log(data);
            router.push("/login");
        } catch (error) {
            console.log(error);
        }
    }
    return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      <div>
        <p>Already have an account?<a href="/login">Login</a></p>
      </div>
    </div>
    )
}

export default registerPage;
