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
import { getAuth, signOut } from "firebase/auth";
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
  where,
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
  const [userData, setUserData] = useState();
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

  const getUserData = async () => {
    if (user) {
      try {
        setLoading(true);

        const docRef = collection(db, "users1");
        const docSnap = query(
          docRef,
          where("userID", "==", userProfile.userID)
        );
        const userData = await getDocs(docSnap);
        let tempArr = [];
        userData.forEach((doc) => {
          tempArr.push(doc.data());
        });
        setUserData(...tempArr);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
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
    getUserData();
  }, []);

  const fetchData = async () => {
    const userDataPosts = await showPosts();
    setPosts(userDataPosts);
  };
  // console.log(posts);

  console.log(user);
  console.log(userData);
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
          bg="#fff"
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
            {/* <Menu>
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
            </Menu> */}
            <Button
              onClick={() => {
                navigate(`/profile/${user.uid}`);
              }}
              variant="link"
              color="#000"
              leftIcon={
                loading ? (
                  ""
                ) : userData ? (
                  <>
                    <Box w="30px" h="30px" borderRadius="50%" overflow="hidden">
                      <Image
                        objectFit="cover"
                        h="100%"
                        w="100%"
                        src={user.photoURL}
                      />
                    </Box>
                  </>
                ) : (
                  <User />
                )
              }
            >
              Profile
            </Button>
          </Flex>
        </Flex>
        {/* dashboard main content wrapper */}
        <Flex
          className="dashboardContent"
          pt="24px"
          align="center"
          justify="center"
        >
          {/* commented grid */}
          <>
            {/* <Grid
            templateRows="repeat(1, 1fr)"
            templateColumns="repeat(4, 1fr)"
            className="dasboard"
          >
            <GridItem colSpan={3} display={loading ? "none" : ""}>
              <Flex align="center" justify="center" flexDirection="column">
                <PostForm fetchData={fetchData} />
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
                          fetchData={fetchData}
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
                      <Heading size="xs">
                        Hello {userProfile.name.toUpperCase()}!
                      </Heading>
                      <Heading size="md">Welcome back.</Heading>
                    </Box>
                  </>
                )}
              </Card>
            </GridItem>
          </Grid> */}
          </>
          <Flex w="100%" h="100%" justify="center">
            <Flex
              flexGrow="1"
              m="0 24px 0 12px"
              py="16px"
              h="100%"
              flexFlow="column"
              align="start"
              border="1px solid #e1e1e1"
              bg="#fff"
              boxShadow="0 12px 24px #e1e1e1"
            >
              <Card w="100%" p="16px 0" bg="#fff">
                {userData ? (
                  userData && (
                    <Flex
                      align="center"
                      justify="center"
                      w="100%"
                      h="100%"
                      flexDirection="column"
                    >
                      <Box
                        w="175px"
                        h="175px"
                        borderRadius="50%"
                        overflow="hidden"
                      >
                        <Image
                          h="100%"
                          w="100%"
                          src={
                            !user.photoURL
                              ? userData.profileImage
                              : user.photoURL
                          }
                          objectFit="cover"
                        />
                      </Box>
                      <Text as="b" fontSize="xl" mt="8px">
                        {userData.name}
                      </Text>
                      <Text color="gray.500" fontSize="xs">
                        {userData.email}
                      </Text>
                    </Flex>
                  )
                ) : (
                  <Text></Text>
                )}
              </Card>
              <Button
                mt="12px"
                onClick={() => {
                  navigate("/dashboard");
                }}
                leftIcon={<ShoppingCart />}
                variant="none"
              >
                Buy&Sell
              </Button>
              <Button
                onClick={() => {
                  navigate("/discover");
                }}
                leftIcon={<Compass />}
                variant="none"
              >
                Discover
              </Button>
            </Flex>
            <Flex flexGrow="1.5" flexDirection="column" bg="#fff">
              <PostForm fetchData={fetchData} />
              <Box border="1px solid #e1e1e1" p="16px 32px">
                {posts &&
                  posts.map((post) => (
                    <Card
                      key={post.id}
                      mb="32px"
                      boxShadow="1px 1px 5px #A5A5A5"
                      borderRadius="6px"
                      style={{ position: "relative" }}
                    >
                      <PostOptions
                        postId={post.id}
                        authorId={post.authorId}
                        fetchData={fetchData}
                      />

                      <Flex ml="24px" mt="16px" textAlign="start">
                        <Box display={post.profileImage ? "block" : "none"}>
                          <Image
                            h="30px"
                            w="30px"
                            borderRadius="50%"
                            src={
                              post.authorId.photoURL ? "" : post.profileImage
                            }
                            mr="8px"
                          />
                        </Box>

                        <Profile name={post.name} authorId={post.authorId} />
                      </Flex>

                      <Text as="kbd" ml="24px" fontSize="10px" color="gray.500">
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

                      <Flex w="100%" align="center" justify="center" mb="12px">
                        <Box w="100%" textAlign="center" m="0 12px">
                          <Comments postID={post.id} authorId={post.authorId} />
                        </Box>
                      </Flex>
                    </Card>
                  ))}
              </Box>
            </Flex>
            <Box flexGrow="1" m="0 12px 0 32px" h="100%" bg="#fff">
              {userProfile && (
                <>
                  <Flex justify="center" flexDirection="column">
                    <Heading fontSize="2xl" pt="6px">
                      Hello {userProfile.name.toUpperCase()}!
                    </Heading>
                    <Heading fontSize="md">Welcome back!</Heading>
                  </Flex>
                </>
              )}
              <Box mt="12px" borderTop="1px solid #e1e1e1">
                <Text color="gray.500" fontSize="xs">
                  Aquarizz | CodeMinded &copy; 2024
                </Text>
                <Text color="gray.500" fontSize="xs">
                  Terms & Conditions
                </Text>
                <Text color="gray.500" fontSize="xs">
                  codeminded.dev@gmail.com
                </Text>
              </Box>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};
export default Dashboard;
