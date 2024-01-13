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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import {
  doc,
  getDoc,
  collection,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";
import { UserAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import ShareModal from "./postOptionsComponents/ShareModal";
import { useNavigate } from "react-router-dom";
const PostOptions = (props) => {
  const { user } = UserAuth();

  const postId = props.postId;
  const fetchData = props.fetchData;
  const authorId = props.authorId;
  const deleteOverlay = useDisclosure();
  const shareModal = useDisclosure();
  const cancelRef = useRef();
  const [postContent, setPostContent] = useState();
  const navigate = useNavigate();
  const getPost = async () => {
    const colRef = collection(db, "posts", postId);
    const docSnap = await getDoc(colRef);
    console.log(docSnap);
  };
  const handleDelete = async () => {
    try {
      const postRef = doc(db, "posts", postId);
      // const commentRef = collection(postRef, "comments");
      await deleteDoc(postRef);
    } catch (err) {
      console.log(err.message);
    }

    fetchData();
  };
  const handleShareButton = () => {
    // shareModal.onOpen();
    navigate(`/profile/${authorId}/post/${postId}`);
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
              deleteOverlay.onOpen();
            }}
            isDisabled={authorId !== user.uid}
          >
            Delete
          </MenuItem>
          <MenuItem onClick={handleShareButton}>
            Share
            {/* modal for sharePost */}
            <Modal isOpen={shareModal.isOpen} onClose={shareModal.onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Share your post.</ModalHeader>
                <ModalCloseButton />
                <ModalBody></ModalBody>

                <ModalFooter>
                  <Button w="100%">Copy Link </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </MenuItem>
        </MenuList>
      </Menu>
      <AlertDialog
        isOpen={deleteOverlay.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={deleteOverlay.onClose}
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
                  deleteOverlay.onClose();
                  handleDelete();
                }}
                ml={3}
              >
                Delete
              </Button>
              <Button ref={cancelRef} onClick={deleteOverlay.onClose}>
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
