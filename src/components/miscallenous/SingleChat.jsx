import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setselectedChat } from "../../store/selectedchatSlice";
import { useDispatch } from "react-redux";
import UpdatedGroupChat from "./UpdatedGroupChat";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import { setFetchAgain } from "../../store/fetchAgainSlice";
import Lottie from 'react-lottie'
import typingAnimation from '../../animations/typing.json'
const ENDPONT = "http://localhost:5000";
var socket, selectedChatCmp;

const SingleChat = () => {
  const selectedChat = useSelector((state) => state.selectedchat.selectedChat);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const fetchAgain = useSelector((state) => state.fetchAgain.fetchAgain);
  // console.log("selected chat admin", selectedChat.groupAdmin._id);
  console.log("selected chat", selectedChat);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);  
  const toast = useToast();

  const arrowbackClick = () => {
    dispatch(setselectedChat(null));
    setMessages([]);
    console.log("selected chat", selectedChat);
  };
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: typingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  useEffect(() => {
    socket = io(ENDPONT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => {
      setIsTyping(true);
    }); 
    socket.on("stop typing", () => {
      setIsTyping(false);
    }
    );
  }, []);
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`);
      console.log("messages", data);

      setMessages(data);
      console.log("all messages from the group", messages);
      setLoading(false);
      socket.emit("join room", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Some error occured",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const typingHanler = (e) => {
    setNewMessage(e.target.value);
    if(!socketConnected) return;
    if(!typing)
    {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerlength = 3000;
    setTimeout(() => {
      var timeDiff = new Date().getTime() - lastTypingTime;
      if(timeDiff >= timerlength && typing)
      {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerlength);
  };
  const sendMessage = async (e) => {
    if (e.key === "Enter") {
      console.log("sending message", newMessage);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log("message", data);
        setNewMessage("");
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Some error occured",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCmp = selectedChat;
  }, [selectedChat]);
  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      console.log("new message received", newMessageReceived);
      if (
        !selectedChatCmp ||
        selectedChatCmp._id !== newMessageReceived.chat._id
      ) {} else {
        setMessages([...messages, newMessageReceived]);
        dispatch(setFetchAgain(!fetchAgain));
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            display="flex"
            fontSize={{ base: "25px", md: "27px" }}
            pb={3}
            px={3}
            w="100%"
            justifyContent={{ base: "center", md: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={arrowbackClick}
            />
            {selectedChat ? (
              <Text>{selectedChat.name}</Text>
            ) : (
              <Text>some</Text>
            )}
            {<UpdatedGroupChat fetchMessages={fetchMessages} />}
          </Text>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
        >
          <Text fontSize="3xl" pb={3}>
            Select a chat to start messaging
          </Text>
        </Box>
      )}
      <Box
        display="flex"
        flexDir="column"
        p={2}
        bg="#E8E8E8"
        w="100%"
        h="100%"
        overflow="hidden"
        borderRadius="lg"
      >
        {loading ? (
          <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
        ) : (
          <div className="messages">
            <ScrollableChat messages={messages} />
          </div>
        )}
        <FormControl onKeyDown={sendMessage}>
        {
          isTyping ? <Lottie height={40} width={60} style={{marginBottom:15,marginLeft:0}} options={defaultOptions}/> : null
        }
          <Input
            variant="filled"
            bg="#E0E0E0"
            placeholder="Enter your message..."
            onChange={typingHanler}
            value={newMessage}
          />
        </FormControl>
      </Box>
    </>
  );
};

export default SingleChat;
