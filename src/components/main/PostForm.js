import { Input, Button, FormControl, Card, Textarea } from "@chakra-ui/react";
const PostForm = () => {
  return (
    <>
      <Card w="100%" variant="elevated" my="12px" border="1px solid #e1e1e1">
        <form
          className="postForm"
          style={{ width: "100%", padding: "8px  16px" }}
        >
          <FormControl display="flex" justifyContent="space-between" my="8px">
            <Input placeholder="Post Title" mr="8px" />
            <Input placeholder="Price" ml="8px" />
          </FormControl>
          <FormControl my="8px">
            <Textarea placeholder="Tell us what you're looking for." />
          </FormControl>
          <Button colorScheme="telegram" type="submit">
            Post
          </Button>
        </form>
      </Card>
    </>
  );
};
export default PostForm;
