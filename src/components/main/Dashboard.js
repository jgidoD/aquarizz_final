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
} from "@chakra-ui/icons";
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
import { formatDistanceToNow } from "date-fns";
import Profile from "./Profile";
import PostOptions from "./mainComponents/PostOptions";
import {useForm} from 'react-hook-form'
import Comments from "./mainComponents/Comment";


const Dashboard = () => {
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState();
  const {register, handleSubmit, reset, formState: {errors}} = useForm()
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
  }, [posts]);

  const fetchData = async () => {
    const userDataPosts = await showPosts();
    setPosts(userDataPosts);

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
              <MenuItem onClick={()=>{navigate("/dashboard")}}>
                Home
              </MenuItem>
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
            templateRows="repeat(1, 1fr)"
            templateColumns="repeat(4, 1fr)"
            className="dasboard"
          >
          { loading && <>
              <p>loading</p>  
            </>
          }
            <GridItem colSpan={3} display={loading? "none" : "" }>
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
                          {formatDistanceToNow(post.datePosted)} ago
                        </Text>
                        <Flex pl="32px" py="32px" justify="space-between">
                        <Box>
                        <Heading size="md">{post.postTitle}</Heading>
                        <br/>

                        <Text fontSize="16px">{post.postContent}</Text>
                        </Box>
                     
                          <Box mr="24px">{ 
                            !post.price? <Text>₱ 0.00</Text>  :  <>
                            <strong>₱ </strong>
                            {post.price}
                            
                            </>
                          }
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
              
           
                        <Box>
                       
                        </Box>
                        </Flex>

                        <div style={{width: "100%", height: "2px", backgroundColor:"#e1e1e1", margin: "0 0 12px 0" }}>
                        </div>
                        
                        <Flex w="100%" align="center" justify="center" mb="12px" >
                        <Box w="100%" textAlign="center" m="0 12px">
                          <Comments postID={post.id} authorId={post.authorId}/>
                        </Box>
                        
                      </Flex>
                      </Card>
                    ))}
                </Box>
              </Flex>
            </GridItem>
            <GridItem rowSpan={2} colSpan={1} w="60%em" bg="#fff" pt="11px" display={loading ? "none" : ""}>
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
                    <Heading size="xs">
                      Hello {userProfile.name.toUpperCase()}!
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
