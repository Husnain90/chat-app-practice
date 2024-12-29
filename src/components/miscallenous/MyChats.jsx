import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setChat } from "../../store/chatSlice";
import { useSelector } from "react-redux";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { setselectedChat } from "../../store/selectedchatSlice";
import GroupChatModel from "./GroupChatModel";
const MyChats = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);
  const selectedChat = useSelector((state) => state.selectedchat.selectedChat);
  const fetchAgain = useSelector((state)=>state.fetchAgain.fetchAgain)
  console.log("fetch again",fetchAgain)
  console.log("chast", chats.chat);
  const getChats = async () => {
    try {
      const chats = await axios.get("/api/chat/fetchChats");
      console.log(chats.data.data);
      dispatch(setChat(chats.data));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getChats();
  }, [fetchAgain]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "33%" }}
      borderRadius="lg"
      borderWidth="1px"
      h="94%"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "24px", md: "26px" }}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My chatts
        <GroupChatModel>

        <Button
          display="flex"
          fontSize={{ base: "14px", md: "16px" }}
          align="center"
          leftIcon={<AddIcon />}
          >
          Create group
        </Button>
          </GroupChatModel>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflow="hidden"
      >
        {chats.length > 0 ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => dispatch(setselectedChat(chat))}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>{chat.name}</Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Text>No Chats Available</Text>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
