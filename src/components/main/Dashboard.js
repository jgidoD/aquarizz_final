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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  HamburgerIcon,
  CloseIcon,
  DeleteIcon,
  ChevronDownIcon,
  TriangleDownIcon,
} from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";

import PostForm from "./PostForm";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
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
import PostLists from "./PostLists";
import { formatDistanceToNow } from "date-fns";
import DisplayPosts from "./DisplayPosts";
import Profile from "./Profile";
import PostOptions from "./mainComponents/PostOptions";

const Dashboard = () => {
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState();

  const { user } = UserAuth();
  const navigate = useNavigate();
  const handleSignOut = () => {
    signOut(auth);
    navigate("/");
  };

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);

        if (!user) {
          // Handle the case when user is not defined
          console.log("can't get user");
          return;
        }
        const docRef = doc(db, "users1", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile((profile) => {
            return { ...profile, ...docSnap.data() };
          });
        }
        setLoading(false);
      } catch (err) {
        // console.log(err.message);
      }
    };
    getProfile();
  }, [user]);

  async function showPosts() {
    const colRef = collection(db, "posts");
    const querySnapshot = await getDocs(
      query(colRef, orderBy("createdAt", "desc"))
    );
    // const q = query(colRef, orderBy("date", "desc"), limit(5));
    const data = [];

    // onSnapshot(colRef, (snapshot) => {
    //   snapshot.docs.forEach((doc) => {
    //     data.push({ ...doc.data(), id: doc.id });
    //   });
    // });

    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data(), id: doc.id });
    });

    return data;
  }

  useEffect(() => {
    fetchData();
  }, [posts]);

  const fetchData = async () => {
    const userDataPosts = await showPosts();
    setPosts(userDataPosts);
  };

  const handleProfile = (e) => {
    e.preventDefault();
    navigate("/profile");
  };

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
                    navigate(`/profile/${user.uid}`);
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={handleSignOut}>Logout</MenuItem>
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
            templateRows="repeat(3, 1fr)"
            templateColumns="repeat(4, 1fr)"
            className="dasboard"
          >
            <GridItem colSpan={3}>
              <Flex align="center" justify="center" flexDirection="column">
                <PostForm />
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
                          fetchData={fetchData}
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
                          {formatDistanceToNow(post.datePosted)}
                        </Text>
                        <Box pl="32px" py="32px">
                          <Text fontSize="16px">{post.postContent}</Text>
                        </Box>
                        <Flex w="100%" align="center" justify="center">
                          <Image
                            src={post.postImg}
                            w="20em"
                            alt="post image"
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        </Flex>
                        <Box
                          w="100%"
                          textAlign="start"
                          pl="80px"
                          pb="32px"
                        ></Box>
                      </Card>
                    ))}
                </Box>
              </Flex>
            </GridItem>
            <GridItem rowSpan={2} colSpan={1} w="60%em" bg="#fff" pt="11px">
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
                      noOfLines={5}
                      spacing="5"
                      height="5em"
                      width="14em"
                    />
                  </>
                )}
                {profile && (
                  <>
                    <Heading size="xs">
                      Hello {profile.name.toUpperCase()}!
                    </Heading>
                    <Heading size="md">Welcome back.</Heading>
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
