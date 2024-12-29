import React, { useState } from "react";
import {
  Box,
  Container,
  Tabs,
  Text,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import Login from "../components/authentication/login";
import Register from "../components/authentication/Register";

function HomePage() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Container maxW={"xl"} centerContent>
      <Box
        d="flex"
        justifyContent="Center"
        textAlign="center"
        padding={3}
        w="100%"
        m="40px 0px 15px 0px"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="3xl">Chitt Chatt</Text>
      </Box>
      <Box d="flex" padding={3} w="100%" borderRadius="lg" borderWidth="1px">
        <Tabs
          variant="soft-rounded"
          colorScheme="green"
          index={tabIndex}
          onChange={(index) => setTabIndex(index)}
        >
          <TabList>
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Register setTabIndex={setTabIndex} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default HomePage;
