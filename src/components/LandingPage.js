import "./LandingPage.css";
import Logo from "../assets/logo.svg";
import {
  Flex,
  Box,
  Button,
  Image,
  Heading,
  Text,
  Card,
  CardBody,
  FormControl,
  Input,
  useDisclosure,
  FormLabel,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Contact from "./Contact";
import { useForm } from "react-hook-form";
import { UserAuth } from "./context/AuthContext";

const LandingPage = () => {
  const { signIn } = UserAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const cancelRef = useRef(null);

  const handleLogin = async (data) => {
    try {
      await signIn(data.email, data.password);
      navigate("/dashboard");
    } catch (err) {
      console.log(err.message);
    }
    reset();
  };
  return (
    <Box w="100vw" h="100vh" className="landingPageWrapper" overflow="hidden">
      <Box className="landingPage">
        <Flex
          className="navbar"
          align="center"
          justify="space-between"
          w="100%"
        >
          <Box>
            <Image src={Logo} />
          </Box>
          <Box>
            <Button
              variant="solid"
              colorScheme="telegram"
              mr="24px"
              onClick={onOpen}
            >
              Contact Us
            </Button>
            <Contact
              isOpen={isOpen}
              onClose={onClose}
              initialFocusRef={initialRef}
              finalFocusRef={finalRef}
            />
          </Box>
        </Flex>
        <Flex className="content">
          <Flex ml="32px" h="75vh" w="100%">
            <Flex
              className="contentText"
              flexDirection="column"
              align="start"
              justify="center"
              ml="100px"
              h="75vh"
              w="100%"
            >
              <Heading size="4xl" color="#000" py="12px">
                Connecting
              </Heading>
              <Text fontSize="3xl" color="#000" as="i">
                for the Love of Healthy Fish
              </Text>
              <Text fontSize="xl" color="#fff">
                A Social media community to connect and sell your items.
              </Text>
              <Link to="/register">
                <Button variant="outline" my="12px" className="signUpBtn">
                  Join Now
                </Button>
              </Link>
            </Flex>
          </Flex>

          <Flex
            flexDirection="column"
            className="contentCard"
            w="100%"
            align="center"
            justify="center"
          >
            <Card bg="#fff" className="loginCard" w="350px" px="24px">
              <CardBody className="cardBody">
                <Heading size="md">Login</Heading>
                <form
                  className="loginForm"
                  onSubmit={handleSubmit(handleLogin)}
                >
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      {...register("email", {
                        required: true,
                      })}
                      aria-invalid={errors.email ? "true" : "false"}
                      type="email"
                      id="email"
                    />
                    {errors.email?.type === "required" && (
                      <p style={{ color: "#d9534f", fontSize: "12px" }}>
                        Email is required
                      </p>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input
                      {...register("password", {
                        required: true,
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters.",
                        },
                      })}
                      aria-invalid={errors.password ? "true" : "false"}
                      type="password"
                      id="password"
                    />
                    {errors.password?.type === "required" && (
                      <p style={{ color: "#d9534f", fontSize: "12px" }}>
                        Password is required
                      </p>
                    )}
                    {errors.password && (
                      <p style={{ color: "#d9534f", fontSize: "12px" }}>
                        {errors.password.message}
                      </p>
                    )}
                  </FormControl>

                  <Button type="submit" w="100%" bg="#ffc947">
                    Login
                  </Button>
                </form>
              </CardBody>
              <Button my="16px" variant="ghost">
                Forgot Password?
              </Button>
            </Card>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
export default LandingPage;
