import React from 'react'
import RegisterForm from '../components/auth/RegisterForm';
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigation = useNavigate();
  const handleNavigate = (e) => {
    e.preventDefault();
    navigation("/login");
  };
  return(
    <RegisterForm/>
  )
}





