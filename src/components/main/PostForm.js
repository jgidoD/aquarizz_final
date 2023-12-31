import { Input, Button, FormControl, Card, Textarea, useToast } from "@chakra-ui/react";
import { useForm} from 'react-hook-form'
import { UserAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const PostForm = () => {
  const {createPost, user} = UserAuth()
  const toast = useToast()
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [userProfile, setUserProfile] = useState();
  
  useEffect(() => {
    const getUserProfile = async () => {
      const data = [];

      try {
        if (!user) {
          // Handle the case when user is not defined
          console.log("can't get user");
          return;
        }
        const docRef = doc(db, "users1", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserProfile((userProfile) => {
            return { ...userProfile, ...docSnap.data() };
          });
        }
      } catch (err) {
      }
    };
    getUserProfile();
  }, [user]);

  
  const handleSubmitPost = async (data) => {
    const obj = {
      postContent: data.content,
      authorId: user?.uid,
      name: userProfile.name,
      // datePosted: Date.now(),
      datePosted: Date.now(),
      createdAt: serverTimestamp(),
      price: data.price,
      postTitle: data.title,
      postImg: ""
    };
    try {
      await createPost(obj)
      toast({
        title: 'Post Created.',
        description: "Post successfully published.",
        status: 'success',
        duration: 5000,
        position: "top"
      })
    }
    catch(err){
      console.log(err.message)
    }
    console.log(obj)
    reset()
  }

  return (
    <>
      <Card w="100%" variant="elevated" my="12px" border="1px solid #e1e1e1">
        <form
          className="postForm"
          style={{ width: "100%", padding: "8px  16px" }}
          onSubmit={handleSubmit(handleSubmitPost)}
          >
          <FormControl display="flex" justifyContent="space-between" my="8px">
            <Input placeholder="Post Title" mr="8px" 
            {
              ...register("title",{ required: true })
            }
              aria-invalid={errors.title? "true" : "false"}
              type="text"
              id="postTitle"
            />
            <Input placeholder="Price" ml="8px" 
            {
              ...register("price",{ required: true })
            }
              aria-invalid={errors.price? "true" : "false"}
              type="number"
              id="price" 
              />
          </FormControl>
          <FormControl my="8px">
            <Textarea placeholder="Tell us what you're looking for."
            {
              ...register("content",{ required: true })
            }
              aria-invalid={errors.content? "true" : "false"}
              id="content" 

            />
          </FormControl>
          <Button colorScheme="telegram" type="submit">
            Post
          </Button>
        </form>
      </Card>
    </>
  );
}
export default PostForm;
