import { Box,Text } from "@chakra-ui/react"
import { useParams } from "react-router-dom"


const PostPage  = () => {
const {postId} = useParams()

    return ( 
        <>
        <Box>
        <Text>This is post page for {postId}</Text>
        
        </Box>
        </>)

}
export default PostPage