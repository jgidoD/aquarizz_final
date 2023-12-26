import {
  FormControl,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  FormLabel,
  Input,
  ModalBody,
  ModalFooter,
  Button,
  ModalCloseButton,
  Textarea,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

const Contact = (props) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSendFeedback = (data) => {
    console.log(data);
    reset();
  };
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        initialFocusRef={props.initialRef}
        finalFocusRef={props.finalRef}
        blockScrollOnMount={false}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Let me know your feedback!</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(handleSendFeedback)}>
            <ModalBody>
              <FormControl>
                <FormLabel>Email:</FormLabel>
                <Input
                  type="email"
                  {...register("email", {
                    required: true,
                  })}
                />
                {errors.email?.type === "required" && (
                  <p style={{ color: "#d9534f", fontSize: "12px" }}>
                    Email is required
                  </p>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Subject:</FormLabel>
                <Input
                  {...register("subject", {
                    required: true,
                  })}
                />
                {errors.subject?.type === "required" && (
                  <p style={{ color: "#d9534f", fontSize: "12px" }}>
                    Subject is required
                  </p>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Message</FormLabel>
                <Textarea
                  {...register("message", {
                    required: true,
                  })}
                />
                {errors.message?.type === "required" && (
                  <p style={{ color: "#d9534f", fontSize: "12px" }}>
                    Message is required
                  </p>
                )}
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" variant="outline">
                Send
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
export default Contact;
