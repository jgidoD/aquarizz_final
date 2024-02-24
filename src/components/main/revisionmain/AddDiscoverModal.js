import "./AddDiscoverModal.css";
import {
  FormLabel,
  InputGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Input,
  Text,
  Flex,
  Heading,
  Box,
  Textarea,
  Button,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

const AddDiscoverModal = (props) => {
  const primaryColor = "#FFC947";
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleSubmitPost = (data) => {};
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <form onSubmit={handleSubmit(handleSubmitPost)}>
              <Box textAlign="center" my="24px">
                <Heading fontSize="md">Let others know what you have!</Heading>
              </Box>
              <Flex
                className="addDiscoverForm"
                flexDirection="column"
                justify="center"
              >
                <Box>
                  <Input
                    placeholder="Title"
                    {...register("title", { required: true })}
                    aria-invalid={errors.title ? "true" : "false"}
                  />
                  {errors.title?.type === "required" && (
                    <p style={{ color: "#d9534f", fontSize: "12px" }}>
                      Title is required
                    </p>
                  )}
                </Box>
                <Box>
                  <Textarea
                    placeholder="Text"
                    {...register("text", { required: true })}
                    aria-invalid={errors.text ? "true" : "false"}
                  />
                  {errors.text?.type === "required" && (
                    <p style={{ color: "#d9534f", fontSize: "12px" }}>
                      Text is required
                    </p>
                  )}
                </Box>
                <Box p="12px 0">
                  <Input
                    className="inputFileDiscover"
                    type="file"
                    name="file"
                    id="file"
                    class="inputfile"
                    multiple
                  />
                </Box>
                <Box>
                  <Input
                    placeholder="e.g. #tag"
                    {...register("tag", { required: true })}
                    aria-invalid={errors.tag ? "true" : "false"}
                  />
                  {errors.text?.type === "required" && (
                    <p style={{ color: "#d9534f", fontSize: "12px" }}>
                      Tag is required
                    </p>
                  )}
                </Box>

                <Button type="submit" bg={primaryColor}>
                  Publish
                </Button>
                <Button onClick={props.onClose}>Cancel</Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AddDiscoverModal;
