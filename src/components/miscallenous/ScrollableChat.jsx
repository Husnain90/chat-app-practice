import { Avatar, Flex, Tooltip } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  islastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/chatLogic";
import { useSelector } from "react-redux";


const ScrollableChat = ({ messages }) => {
  const user = useSelector((state) => state.auth.user);
  const selectedChat = useSelector((state) => state.selectedchat.selectedChat);
  console.log("selected",selectedChat)
  
  console.log("messages in scrool",messages)
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              islastMessage(messages, i, user._id)) &&
              (user._id === selectedChat.groupAdmin._id ? (
                <Tooltip
               
                  label={m.sender.AnonymousName}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    name={m.sender.AnonymousName}
                    src={m.sender.avatar}
                    size="sm"
                    cursor="pointer"
                  />
                </Tooltip>
              ) : (
                <Tooltip label={"Anonymous"} placement="bottom-start" hasArrow>
                  <Avatar name={"Anonymous"} size="sm" cursor="pointer" />
                </Tooltip>
              ))}
            <span
              style={{
                backgroundColor:
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0",
                padding: "10px",
                borderRadius: "10px",
                margin: "5px",
                maxWidth: "60%",
                wordWrap: "break-word",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i) ? "0px" : "10px",
              }}
            >
              {m.content}
          
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
