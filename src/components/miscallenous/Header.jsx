import { Avatar, Box, Button, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React from "react";
import { useSelector } from "react-redux";
import ProfileModel from "./ProfileModel";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const handleLogout = () => {
    console.log("Logout");
    const myCookie = Cookies.get("token");
   console.log("Cookie value:", myCookie); 
  
      navigate("/");
  
  }
  return (
    <>
      <Box
        display="flex"
        backgroundColor="lightgray"
        w="100%"
        h="7vh"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text fontSize="2xl">Welcome {user.AnonymousUserName}</Text>
        <Text fontSize="2xl">Chitt Chatt</Text>
        <div>
          <Menu>
            <MenuButton p={4}>
              <BellIcon fontSize="2xl" />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon fontSize="2xl" />}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user? user.AnonymousUserName:""}
              />
            </MenuButton>
            <MenuList>
              <MenuItem>
              <ProfileModel>
                My Profile
              </ProfileModel>
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
    </>
  );
};

export default Header;
