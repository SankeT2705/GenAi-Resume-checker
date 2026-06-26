import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'

const Protected = ({children}) => {

    const {loading,user}=useAuth()
     if (loading) {
  return (
    <div className="auth__loading">
      <div className="loader"></div>

      <h2>Loading</h2>

      <p>
        Setting up your profile and preparing your workspace.
      </p>
    </div>
  );
}

    if(!user){
          return <Navigate to={'/login'}/>
    }
  return children
}

export default Protected