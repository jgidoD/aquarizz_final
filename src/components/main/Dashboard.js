import "./Dashboard.css";
import {
  Flex,
  Input,
  Box,
  Grid,
  Heading,
  MenuButton,
  Menu,
  Button,
  Text,
  GridItem,
  Card,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuList,
  MenuItem,
  IconButton,
  SkeletonText,
  SkeletonCircle,
  Skeleton,
  Image,
  MenuGroup,
  MenuDivider,
  Divider,
  useDisclosure,
  Alert,
  AlertDialog,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { HamburgerIcon } from "@chakra-ui/icons";
import PostForm from "./PostForm";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import {
  doc,
  getDoc,
  query,
  getDocs,
  orderBy,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import Profile from "./Profile";
import { useForm } from "react-hook-form";
import Comments from "./mainComponents/Comment";
import PostComponent from "../PostComponent";
import PostOptions from "./mainComponents/PostOptions";
import { Home, Compass, User, LogOut, ShoppingCart } from "react-feather";

const Dashboard = () => {
  // const [profile, setProfile] = useState();
  const alert = useDisclosure();
  const cancelRef = useRef();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { user, userProfile } = UserAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth);
    navigate("/");
  };

  async function showPosts() {
    const colRef = collection(db, "posts");
    const querySnapshot = await getDocs(
      query(colRef, orderBy("createdAt", "desc"))
    );
    const data = [];

    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data(), id: doc.id });
    });

    return data;
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const userDataPosts = await showPosts();
    setPosts(userDataPosts);
  };
  console.log(posts);
  return (
    <>
      {/* container */}
      <Box className="dashboardWrapper" h="100vh" w="100vw">
        {/* navbarContainer */}
        <Flex
          className="navbar"
          justify="space-between"
          px="32px"
          py="12px"
          boxShadow="1px 0px 12px #aeaeae"
          w="100vw"
          overflow="hidden"
        >
          <Heading
            size="xl"
            onClick={() => {
              window.location.reload();
            }}
            cursor="pointer"
          >
            Market
          </Heading>
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
                  icon={<ShoppingCart size={16} />}
                >
                  Buy/Sell
                </MenuItem>
                <Link to="/discover">
                  <MenuItem icon={<Compass size={16} />}>Discover</MenuItem>
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
                  <MenuItem icon={<LogOut size={16} />} onClick={alert.onOpen}>
                    Logout
                    <AlertDialog isOpen={alert.isOpen} onClose={alert.onClose}>
                      <AlertDialogOverlay />
                      <AlertDialogContent>
                        <AlertDialogHeader>Are you leaving?</AlertDialogHeader>
                        <AlertDialogFooter>
                          <Button
                            onClick={handleSignOut}
                            colorScheme="red"
                            mr="6px"
                          >
                            Yes
                          </Button>
                          <Button ml="6px" onClick={alert.onClose}>
                            No
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </MenuItem>
                </MenuGroup>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
        {/* dashboard main content wrapper */}
        <Flex
          className="dashboardContent"
          pt="24px"
          align="center"
          justify="center"
        >
          <Grid
            templateRows="repeat(1, 1fr)"
            templateColumns="repeat(4, 1fr)"
            className="dasboard"
          >
            {loading && (
              <>
                <p>loading</p>
              </>
            )}
            <GridItem colSpan={3} display={loading ? "none" : ""}>
              <Flex align="center" justify="center" flexDirection="column">
                <PostForm />
                {/* <PostComponent /> */}
                <Box border="1px solid #e1e1e1" w="100%" p="16px 32px">
                  {posts &&
                    posts.map((post) => (
                      <Card
                        key={post.id}
                        my="25px"
                        boxShadow="1px 1px 5px #A5A5A5"
                        borderRadius="6px"
                        style={{ position: "relative" }}
                      >
                        <PostOptions
                          postId={post.id}
                          authorId={post.authorId}
                        />

                        <Box ml="24px" mt="16px" textAlign="start">
                          <Profile name={post.name} authorId={post.authorId} />
                        </Box>

                        <Text
                          as="kbd"
                          ml="24px"
                          fontSize="10px"
                          color="gray.500"
                        >
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

                        <Flex
                          w="100%"
                          textAlign="start"
                          p="12px 0 12px 0"
                          align="center"
                          justify="space-around"
                        >
                          <Box></Box>
                        </Flex>

                        <div
                          style={{
                            width: "100%",
                            height: "2px",
                            backgroundColor: "#e1e1e1",
                            margin: "0 0 12px 0",
                          }}
                        ></div>

                        <Flex
                          w="100%"
                          align="center"
                          justify="center"
                          mb="12px"
                        >
                          <Box w="100%" textAlign="center" m="0 12px">
                            <Comments
                              postID={post.id}
                              authorId={post.authorId}
                            />
                          </Box>
                        </Flex>
                      </Card>
                    ))}
                </Box>
              </Flex>
            </GridItem>
            <GridItem
              rowSpan={2}
              colSpan={1}
              w="60%em"
              bg="#fff"
              pt="11px"
              display={loading ? "none" : ""}
            >
              <Card
                w="120%"
                h="7em"
                p="16px 32px"
                border="1px solid #e1e1e1"
                display="flex"
                justifyContent="center"
              >
                {loading && (
                  <>
                    <Skeleton height="20px" mb="20px" />
                    <SkeletonText
                      mt="4"
                      noOfLines={2}
                      spacing="5"
                      height="5em"
                      width="14em"
                    />
                  </>
                )}
                {userProfile && (
                  <>
                    <Box position="relative">
                      {/* <Image
                        src={require("../../assets/Animation - 1705294347366.gif")}
                        w="80px"
                        position="absolute"
                        top="-60px"
                        right="35px"
                      /> */}
                      <Heading size="xs">
                        Hello {userProfile.name.toUpperCase()}!
                      </Heading>
                      <Heading size="md">Welcome back.</Heading>
                    </Box>
                  </>
                )}
              </Card>
            </GridItem>
          </Grid>
        </Flex>
      </Box>
    </>
  );
};
export default Dashboard;
