import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text
} from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";

const ProfileModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useSelector((state) => state.auth.user);
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{user.AnonymousUserName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="bold" mb="1rem">
                Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
        
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModel;
