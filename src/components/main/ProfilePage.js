import "./ProfilePage.css";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams, Link } from "react-router-dom";
import { collection, getDocs, doc, query, where } from "firebase/firestore";
import {
  Box,
  Heading,
  useCardStyles,
  Card,
  Flex,
  Text,
  MenuButton,
  Menu,
  MenuItem,
  MenuList,
  IconButton,
  Image,
  MenuGroup,
  MenuDivider,
  Button,
  useDisclosure,
  Modal,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
} from "@chakra-ui/react";
import { db, auth } from "../../firebase/firebaseConfig";
import { UserAuth } from "../context/AuthContext";
import { HamburgerIcon } from "@chakra-ui/icons";
import { signOut } from "firebase/auth";
import { formatDistanceToNow } from "date-fns";
import Profile from "./Profile";
import PostOptions from "./mainComponents/PostOptions";
import { Home, Compass, User, LogOut, Edit } from "react-feather";
import Comment from "./mainComponents/Comment";

function ProfilePage() {
  const { userId } = useParams();
  // const { postId } = useParams();
  const { user } = UserAuth();
  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState(null);
  const navigate = useNavigate();
  const editProfile = useDisclosure();

  const handleSignOut = () => {
    signOut(auth);
    navigate("/");
  };

  //check the location
  let getUrl = window.location.href;
  //take out every `/` to array
  let splitUrl = getUrl.split("/");

  const loadData = async () => {
    if (!userId) return; // Handle missing ID

    // const docRef = collection(db, "users1"); // Replace "db" with  Firestore instance
    // const docSnap = query(docRef, where("userID", "==", splitUrl[4]));
    // const userDataVar = await getDocs(docSnap);
    // let testData = userDataVar.forEach((doc) => doc.id);
    // console.log(testData);

    const docRef = collection(db, "users1"); // Replace "db" with  Firestore instance
    const docSnap = query(docRef, where("userID", "==", userId));
    const userDataVar = await getDocs(docSnap);
    let tempArr = [];
    let testData = userDataVar.forEach((doc) => {
      tempArr.push(doc.data());
    });
    setUserData(...tempArr);
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  useEffect(() => {
    const getUserPosts = async () => {
      const docRef = collection(db, "posts");
      const docSnap = query(docRef, where("authorId", "==", userId));
      const postDataVar = await getDocs(docSnap);

      let tempArr = [];

      let testData = postDataVar.forEach((doc) => {
        tempArr.push({ ...doc.data(), id: doc.id });
      });
      setPostData(tempArr);
    };
    getUserPosts();
  }, []);

  return (
    <>
      <Box>
        {userData && userData ? (
          <Box key={userData.id}>
            <Box>
              <Flex
                className="navbar"
                justify="space-between"
                px="32px"
                py="12px"
                boxShadow="1px 0px 12px #aeaeae"
                w="100vw"
                overflow="hidden"
              >
                <Heading size="xl">Feed</Heading>
                <Flex>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      variant="outline"
                      icon={<HamburgerIcon />}
                    ></MenuButton>
                    <MenuList>
                      <MenuItem
                        onClick={() => {
                          navigate("/dashboard");
                        }}
                        icon={<Home size={16} />}
                      >
                        Home
                      </MenuItem>
                      <Link to="/discover">
                        <MenuItem icon={<Compass size={16} />}>
                          Discover
                        </MenuItem>
                      </Link>

                      <MenuDivider />
                      <MenuGroup title="Account">
                        <MenuItem
                          onClick={() => {
                            navigate(`/profile/${user.uid}`);
                          }}
                          icon={<User size={16} />}
                        >
                          Profile
                        </MenuItem>
                        <MenuItem
                          icon={<LogOut size={16} />}
                          onClick={handleSignOut}
                        >
                          Logout
                        </MenuItem>
                      </MenuGroup>
                    </MenuList>
                  </Menu>
                </Flex>
              </Flex>
            </Box>

            {/* ... display other user's information */}
            <Flex
              pt="24px"
              align="center"
              justify="center"
              flexDirection="column"
            >
              <Flex w="100%">
                <Box>
                  <Flex
                    justify="center"
                    align="center"
                    h="150px"
                    w="150px"
                    ml="200px"
                    borderRadius="50%"
                    border="1px solid red"
                  >
                    <Text>Profile here</Text>
                  </Flex>
                </Box>

                <Flex mx="100px" flexDirection="column">
                  <Box>
                    <Heading>{userData.name}</Heading>
                    <Text fontSize="sm">
                      <strong>UID: </strong>
                      {userData.userID}
                    </Text>
                    <Text color="#9c9c9c" fontSize="xs" as="i">
                      Member since {formatDistanceToNow(userData.dateCreated)}{" "}
                      ago
                    </Text>
                  </Box>

                  <br />

                  <Box>
                    <Text>
                      <strong>Location: </strong>
                      {userData.location}
                    </Text>
                    <Text>
                      <strong>Email: </strong>
                      {userData.email}
                    </Text>
                    <Text>
                      <strong>Phone Number: </strong>
                      {userData.phone}
                    </Text>
                  </Box>
                </Flex>
                <Box>
                  <Button
                    onClick={() => {
                      editProfile.onOpen();
                    }}
                    variant="outline"
                  >
                    Edit Profile
                  </Button>
                  <Modal
                    isOpen={editProfile.isOpen}
                    onCLose={editProfile.onClose}
                  >
                    <ModalHeader>Profile</ModalHeader>
                    <ModalCloseButton />
                    <ModalContent>HATDOG</ModalContent>
                  </Modal>
                </Box>
              </Flex>

              <Flex
                w="100%"
                justify="center"
                align="center"
                flexDirection="column"
                boxShadow="0px -4px 5px #e1e1e1"
                mt="32px"
                py="24px"
              >
                {postData && postData.length === 0 ? (
                  <Flex justify="center" align="center">
                    <Text color="#7f7f7f">It feels so lonely here...</Text>
                  </Flex>
                ) : (
                  postData &&
                  postData.map((post) => (
                    <Card key={post.id} w="50%" p="24px 24px" my="12px">
                      <Flex flexDirection="column">
                        <Box>
                          <Profile name={post.name} authorId={post.authorId} />
                        </Box>
                        <PostOptions
                          postId={post.id}
                          authorId={post.authorId}
                        />
                        <Text as="kbd" fontSize="10px" color="gray.500">
                          {formatDistanceToNow(post.datePosted)} ago
                        </Text>

                        <Flex pl="32px" py="32px" justify="space-between">
                          <Box>
                            <Heading size="md">{post.postTitle}</Heading>
                            <br />

                            <Text fontSize="16px">{post.postContent}</Text>
                          </Box>

                          <Box mr="24px">
                            {!post.price ? (
                              <Text>₱ 0.00</Text>
                            ) : (
                              <>
                                <strong>₱ </strong>
                                {post.price}
                              </>
                            )}
                          </Box>
                        </Flex>
                        <Flex w="100%" align="center" justify="center">
                          <Image
                            src={post.postImg}
                            w="20em"
                            alt="post image"
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        </Flex>
                        <Box w="100%">
                          <Comment postID={post.id} authorId={post.authorId} />
                        </Box>
                      </Flex>
                    </Card>
                  ))
                )}
              </Flex>
            </Flex>
          </Box>
        ) : (
          <Flex w="100%" h="100vh" align="center" justify="center">
            <span className="loader"></span>
          </Flex>
        )}
      </Box>
    </>
  );
}

export default ProfilePage;
