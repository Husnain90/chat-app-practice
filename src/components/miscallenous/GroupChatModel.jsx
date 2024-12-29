import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import UserListItem from "./UserlistItems";
import UserBadgeItem from "./UserBadgeItem";
import { useDispatch } from "react-redux";
// import { setChat } from "../../store/chatSlice";
import { useSelector } from "react-redux";
import { setChat } from "../../store/chatSlice";

const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const toast = useToast();
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);
  console.log("here is the serach", searchResult);
  const handledelete = (userToDelete) => {
    const newUsers = selectedUsers.filter(
      (user) => user._id !== userToDelete._id
    );
    setSelectedUsers(newUsers);
  };
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        description: "User is already added to the group",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  const handleSeacrh = async (query) => {
    if (!query) {
      return;
    }
    try {
      const { data } = await axios.get(`/api/user?search=${query}`);
      setSearchResult(data);
      // console.log(data);
    } catch (error) {
      toast({
        title: "Error occured",
        description: "failed to load the serach result",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length < 1) {
      toast({
        title: "Error occured",
        description: "Group name and users are required",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    try {
      const { data } = await axios.post("/api/chat/createGroupchat", {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((user) => user._id)),
      });
      toast({
        title: "Group created",
        description: "Group chat created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      console.log(data);

      dispatch(setChat([data, ...chats]));
      onClose();
    } catch (error) {
      toast({
        title: "Error occured",
        description: "Failed to create group chat",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="25px" display="flex" justifyContent="center">
            Create Group chat{" "}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl pb="6px">
              <Input
                mb={1}
                placeholder="Enter the group name"
                padding="10px"
                borderColor="gray.300"
                borderWidth="1px"
                pb="4px"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                mb={1}
                placeholder="Add users "
                padding="10px"
                borderColor="gray.300"
                borderWidth="1px"
                pb="4px"
                onChange={(e) => handleSeacrh(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          {
            <Box>
              {selectedUsers.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handledelete(user)}
                />
              ))}
            </Box>
          }
          {searchResult ? (
            searchResult
              ?.slice(0, 4)
              .map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
          ) : (
            <div>loading</div>
          )}
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
