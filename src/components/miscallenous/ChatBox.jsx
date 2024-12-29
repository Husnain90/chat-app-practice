import { Box } from '@chakra-ui/react';
import React from 'react'
import {useSelector} from 'react-redux'
import SingleChat from './SingleChat';
function ChatBox() {
  const selectedChat = useSelector((state) => state.selectedchat.selectedChat);
  console.log(selectedChat)
  return (
    <Box display={{base:selectedChat?"flex":"none",md:"flex"}}
    alignItems="center"
    flexDir="column"
    p={3}
    bg="white"
    w={{base:"100%",md:"66%"}}
    borderRadius="lg"
    borderWidth="1px"
    h="94%"
    >
        <SingleChat/>
    </Box>
  )
}

export default ChatBox
