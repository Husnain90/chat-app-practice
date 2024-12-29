import { Box } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import MyChats from "../components/miscallenous/MyChats";
import ChatBox from "../components/miscallenous/ChatBox";
import axios from "axios";
import Header from "../components/miscallenous/Header";
import { login } from "../store/authSlice";

function ChatPage() {
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      const user = await axios.get("/api/user/getUser");
      console.log(user);
      dispatch(login(user.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const user = useSelector((state) => state.auth.user);
  console.log(user);

  useEffect(() => {
    // Hide scrollbars and make page unscrollable
    document.body.style.overflow = "hidden";

    // Cleanup function to reset the overflow style
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div style={{ width: "100%" }}>
      {user && <Header />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="100vh"
        p="10px"
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
}

export default ChatPage;
