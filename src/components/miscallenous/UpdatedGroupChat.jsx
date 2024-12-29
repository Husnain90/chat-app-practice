import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
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
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserBadgeItem from "./UserBadgeItem";
import axios from "axios";
import { setFetchAgain } from "../../store/fetchAgainSlice";
import { setselectedChat } from "../../store/selectedchatSlice";
import UserListItem from "./UserlistItems";

const UpdatedGroupChat = ({ fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const toast = useToast();
  const selectedChat = useSelector((state) => state.selectedchat.selectedChat);
  const user = useSelector((state) => state.auth.user);
  const fetchAgain = useSelector((state) => state.fetchAgain.fetchAgain);
  const dispatch = useDispatch();

  const handleDelete = async (user) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/chat/removeFromGroup",
        {
          memberId: user._id,
          chatId: selectedChat._id,
        },
        config
      );
      console.log("data ", data);
      user._id === selectedChat.groupAdmin._id
        ? dispatch(setselectedChat(null))
        : dispatch(setselectedChat(data));
      fetchMessages();
      dispatch(setFetchAgain(!fetchAgain));

      if (user._id === selectedChat.groupAdmin._id) {
        toast({
          title: "You have left the group",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
      } else {
        toast({
          title: "User removed from the group",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Internal server error",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
    }
  };
  const handleRename = async () => {
    if (!groupChatName) {
      toast({
        title: "Plz enter a group name",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/chat/renameGroup",
        {
          chatId: selectedChat._id,
          name: groupChatName,
        },
        config
      );
      console.log("data", data);
      dispatch(setselectedChat(data));
      dispatch(setFetchAgain(!fetchAgain));
    } catch (error) {
      toast({
        title: "Internal server error",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  const handleSearch = async (query) => {
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
  const handleRemove = () => {};
  const handleAddUser = async (user) => {
    if (selectedChat.members.find((u) => u._id === user._id)) {
      toast({
        title: "User already in the group",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/chat/addTogroup",
        {
          chatId: selectedChat._id,
          memberId: user._id,
        },
        config
      );

      dispatch(setselectedChat(data));
      dispatch(setFetchAgain(!fetchAgain));
    } catch (error) {}
  };

  return (
    <>
      <IconButton display="flex" icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.name}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Text fontSize="2xl" fontWeight={400}>
              Admin: {selectedChat.groupAdmin.AnonymousName}
            </Text>

            {user && user._id === selectedChat.groupAdmin._id ? (
              <>
                <Text mt="4px">Member list </Text>
                <Box mt="2px">
                  {selectedChat &&
                    selectedChat.members.map((user) => (
                      <UserBadgeItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleDelete(user)}
                      />
                    ))}
                </Box>
                <FormControl>
                  <Box display="flex" flexDir="row">
                    <Input
                      placeholder="rename group name "
                      mb={2}
                      value={groupChatName}
                      onChange={(e) => setGroupChatName(e.target.value)}
                    />

                    <Button
                      variant="solid"
                      colorScheme="blue"
                      ml={1}
                      onClick={handleRename}
                    >
                      Update
                    </Button>
                  </Box>
                </FormControl>
                <FormControl>
                  <Input
                    placeholder="Add user to group"
                    mb={1}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </FormControl>
                {searchResult ? (
                  searchResult
                    ?.slice(0, 4)
                    .map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleAddUser(user)}
                      />
                    ))
                ) : (
                  <div>loading</div>
                )}
              </>
            ) : (
              <>Added by : {selectedChat.groupAdmin.AnonymousName}</>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleDelete(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdatedGroupChat;
