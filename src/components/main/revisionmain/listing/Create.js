import { Box, FormLabel, Heading, Input, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../../context/AuthContext";
const Create = () => {
  const primaryColor = "#FFC947";
  const primaryFont = '"Poppins", sans-serif';
  const secondaryFont = '"Montserrat", sans-serif';
  const navigate = useNavigate();
  const { user } = UserAuth();
  return (
    <>
      <Box className="addProductWrapper">
        <Box className="headerWrapper">
          <Heading>Add Product</Heading>
        </Box>
        <Box className="addProductContentWrapper">
          <Box className="addProductForm">
            <form>
              <Box>
                <FormLabel>Product Name</FormLabel>
                <Input />
              </Box>
              <Box>
                <FormLabel>Description</FormLabel>
                <Input />
              </Box>
              <Box>
                <FormLabel>Add Media</FormLabel>
                <Input type="file" />
              </Box>
              <Box>
                <FormLabel>Tag/s</FormLabel>
                <Input />
              </Box>
              <Box>
                <FormLabel>Price</FormLabel>
                <Input />
              </Box>
              <Button>Save & Publish</Button>
              <Button>Cancel</Button>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default Create;
