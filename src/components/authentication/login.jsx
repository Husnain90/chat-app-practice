import {
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {login} from "../../store/authSlice"

import { useNavigate } from "react-router-dom";


function Login() {
  const [AnonymousUserName, setAnonymousUserName] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmission =  async (e) => {
    // Implement the login functionality here
   e.preventDefault();
   console.log(AnonymousUserName,password);
    if(AnonymousUserName===""||password===""){
      toast(
        {
          title:"Please fill all the fields",
          duration:5000,
          position:"top-right",
          isClosable:true,
          colorScheme:"red"
        }
      )
      return;
    }
    try{
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/users/login",
        { AnonymousUserName, password },
        config
      );
      // console.log(data);
      // dispatch(login(data));
      if (data) {
        toast({
          title: "User logged in successfully",
          duration: 5000,
          position: "top-right",
          isClosable: true,
          colorScheme: "green",
        });
      }
      navigate("/chatpage");
    }
    catch(error)
    {
      toast({
        title: "Invalid username or password",
        duration: 5000,
        position: "top-right",
        isClosable: true,
        colorScheme: "red",
      });
    }
  }
  return (
    <VStack spacing="3px">
      <FormControl isRequired>
        <FormLabel>Anonymous Username</FormLabel>
        <Input type="text" placeholder="Anonymous Username" onChange={(e)=>setAnonymousUserName(e.target.value)}/>

        <FormLabel>Password</FormLabel>
        <Input type="password" placeholder="pasword"
        onChange={(e)=>setPassword(e.target.value)} />
      </FormControl>
      <Button
        colorScheme="blue"
        size="lg"
        width="100%"
        m="4px"
        onClick={handleSubmission}
      >
        Login
      </Button>
    </VStack>
  );
}

export default Login;
