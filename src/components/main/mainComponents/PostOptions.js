import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
  useDisclosure,
  Alert,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { doc, getDoc, collection, deleteDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";
import { UserAuth } from "../../context/AuthContext";
import { useRef } from "react";

const PostOptions = (props) => {
  const { user } = UserAuth();

  const postId = props.postId;
  const fetchData = props.fetchData;
  const authorId = props.authorId;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const handleDelete = async () => {
    try {
      const postRef = doc(db, "posts", postId);
      const commentRef = collection(postRef, "comments");
      await deleteDoc(postRef);
    } catch (err) {
      console.log(err.message);
    }

    fetchData();
  };

  return (
    <>
      <Menu>
        <MenuButton
          style={{
            position: "absolute",
            top: "15px",
            right: "25px",
          }}
        >
          <FontAwesomeIcon icon={faEllipsisH} />
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => {
              onOpen();
            }}
            isDisabled={authorId !== user.uid}
          >
            Delete
          </MenuItem>
        </MenuList>
      </Menu>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Post
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                colorScheme="red"
                onClick={() => {
                  onClose();
                  handleDelete();
                }}
                ml={3}
              >
                Delete
              </Button>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default PostOptions;
