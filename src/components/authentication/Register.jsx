import {
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";

function Register({ setTabIndex }) {
  const [AnonymousName, setAnonymousName] = useState("");
  const [AnonymousUserName, setAnonymousUserName] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(AnonymousName, AnonymousUserName, email, password);
    if (
      AnonymousName === "" ||
      AnonymousUserName === "" ||
      email === "" ||
      password === ""
    ) {
      toast({
        title: "Please fill all the fields",

        duration: 5000,
        position: "top-right",
        isClosable: true,
        colorScheme: "red",
      });
      return;
    }
    try {
      // Register the user
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/users/register",
        { AnonymousName, AnonymousUserName, email, password },
        config
      );
      console.log(data);
      if (data) {
        toast({
          title: "User registered successfully",
          duration: 5000,
          position: "top-right",
          isClosable: true,
          colorScheme: "green",
        });
      }
      setTabIndex(0); // Switch to the Login tab
    } catch (error) {
      if (
        error.response &&
        error.response.data.message === "User already exists"
      ) {
        
        toast({
          title: "User already exists",
          duration: 5000,
          position: "top-right",
          isClosable: true,
          colorScheme: "red",
        });
      } else {
        toast({
          title: "An error occurred. Please try again later.",
          duration: 5000,
          position: "top-right",
          isClosable: true,
          colorScheme: "red",
        });
      }
      
    }
  };

  return (
    <VStack spacing="3px">
      <FormControl isRequired>
        <FormLabel>Anonymous name</FormLabel>
        <Input
          type="text"
          placeholder="Anonymous name"
          onChange={(e) => setAnonymousName(e.target.value)}
        />
        <FormLabel>Anonymous Username</FormLabel>
        <Input
          type="text"
          placeholder="Anonymous Username"
          onChange={(e) => setAnonymousUserName(e.target.value)}
        />
        <FormLabel>email</FormLabel>
        <Input
          type="email"
          placeholder="email"
          onChange={(e) => setemail(e.target.value)}
        />
        <FormLabel>password</FormLabel>
        <Input
          type="password"
          placeholder="password"
          onChange={(e) => setpassword(e.target.value)}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        size="lg"
        width="100%"
        m="4px"
        onClick={handleSubmit}
      >
        Register
      </Button>
    </VStack>
  );
}

export default Register;
