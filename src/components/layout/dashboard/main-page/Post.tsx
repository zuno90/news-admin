// Chakra imports
import { useNavigate } from "react-router-dom"
import {
    Text,
    Button,
    useColorModeValue,
    Box,
    Stack,
    Heading,
    Avatar,
    SimpleGrid,
    Flex,
    IconButton,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    useDisclosure,
    Switch,
    Tooltip,
    VStack,
} from "@chakra-ui/react"
import { VscAdd } from "react-icons/vsc"
import { useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { GET_ALL_POSTS } from "../../../../graphql-query/post/query"
import { IPostData } from "../../../../types/data.type"
import Moment from "react-moment"
import { BsThreeDotsVertical } from "react-icons/bs"
import { FcGlobe, FcSupport, FcEmptyTrash } from "react-icons/fc"
import ModalComponent from "../../../../modules/ModalComponent"
import { REMOVE_POST, UPDATE_STATUS_POST } from "../../../../graphql-query/post/mutation"
import { useToast } from "../../../../utils/toast"

type TPostCard = {
    bgColor: string
    textColor: string
    data: IPostData
}

const PostCard = ({ bgColor, textColor, data }: TPostCard) => {
    const categoryColor = useColorModeValue("purple.700", "purple.200")
    return (
        <Box bg={bgColor} boxShadow="lg" rounded="md" pos="relative">
            <Box mt="2" textAlign="center">
                <Avatar
                    src={data.thumbnail}
                    size="xl"
                    _after={{
                        content: '""',
                        w: 4,
                        h: 4,
                        bg: data.status === "Active" ? "green.300" : "red.300",
                        rounded: "full",
                        pos: "absolute",
                        bottom: 0,
                        right: 3,
                    }}
                />
            </Box>
            <Stack p="4">
                <Text
                    color={categoryColor}
                    textTransform="uppercase"
                    fontWeight="800"
                    fontSize="sm"
                    letterSpacing="1.1"
                >
                    {data.category.title}
                </Text>
                <Heading color={textColor} fontSize="xl">
                    {data.title}
                </Heading>
                <Text color="gray.500">{data.description}</Text>
            </Stack>
            <Stack p="4" direction="row" spacing="2" align="center">
                <Avatar src="https://avatars0.githubusercontent.com/u/1164541?v=4" />
                <Stack direction="column" fontSize="sm">
                    <Text fontWeight="600">{data.author.name}</Text>
                    <Text color={textColor}>
                        <Moment date={data.createdAt} format="DD/MM/YYYY hh:mm:ss A" />
                    </Text>
                </Stack>
            </Stack>
            {/* card option */}
            <Box pos="absolute" right="1" top="1">
                <CardOption id={data._id} status={data.status} />
            </Box>
        </Box>
    )
}

const CardOption = ({ id, status }: { id: string; status: string }) => {
    const toast = useToast()
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure() // Remove post

    const [updateStatusPostMutation, { loading: updateStatusPostLoading }] = useMutation(UPDATE_STATUS_POST, {
        onCompleted({ updateStatusPost }) {
            const { success, msg } = updateStatusPost
            if (!success)
                return toast({
                    title: "Opps...",
                    description: msg,
                    status: "error",
                })
            toast({
                title: "Congrt!",
                description: msg,
                status: "success",
            })
        },
        refetchQueries: [{ query: GET_ALL_POSTS }],
    })
    const handleUpdateStatusPost = () => {
        try {
            updateStatusPostMutation({ variables: { id } })
        } catch (error) {
            console.error(error)
        }
    }

    const [removePostMutation, { loading: removePostLoading }] = useMutation(REMOVE_POST, {
        onCompleted({ removePost }) {
            const { success, msg } = removePost
            if (!success)
                toast({
                    title: "Opps...",
                    description: msg,
                    status: "error",
                })
            toast({
                title: "Congrt!",
                description: msg,
                status: "success",
            })
            return onClose()
        },
        refetchQueries: [{ query: GET_ALL_POSTS }],
    })
    const handleRemovePost = () => {
        try {
            removePostMutation({ variables: { id } })
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            <Flex justifyContent="center">
                <Popover placement="bottom" isLazy>
                    <PopoverTrigger>
                        <IconButton
                            aria-label="More server options"
                            icon={<BsThreeDotsVertical />}
                            bg="transparent"
                            w="fit-content"
                        />
                    </PopoverTrigger>
                    <PopoverContent w="fit-content" _focus={{ boxShadow: "none" }}>
                        <PopoverArrow />
                        <PopoverBody>
                            <Stack>
                                <Tooltip label="On/Off to change post status" placement="top">
                                    <Button
                                        w="150px"
                                        variant="ghost"
                                        justifyContent="space-between"
                                        fontWeight="normal"
                                        fontSize="sm"
                                    >
                                        <Text color={status === "Active" ? "green" : "red"} fontWeight="700">
                                            {status}
                                        </Text>
                                        <Switch
                                            defaultChecked={status === "Active" ? true : false}
                                            onChange={handleUpdateStatusPost}
                                            colorScheme="teal"
                                            size="lg"
                                        />
                                    </Button>
                                </Tooltip>
                                <Button
                                    w="150px"
                                    variant="ghost"
                                    rightIcon={<FcGlobe />}
                                    justifyContent="space-between"
                                    fontWeight="normal"
                                    fontSize="sm"
                                >
                                    View
                                </Button>
                                <Button
                                    onClick={() => navigate(`/post/update/${id}`, { replace: true })}
                                    w="150px"
                                    variant="ghost"
                                    rightIcon={<FcSupport />}
                                    justifyContent="space-between"
                                    fontWeight="normal"
                                    fontSize="sm"
                                >
                                    Update
                                </Button>
                                <Button
                                    onClick={onOpen}
                                    w="150px"
                                    variant="ghost"
                                    rightIcon={<FcEmptyTrash />}
                                    justifyContent="space-between"
                                    fontWeight="normal"
                                    fontSize="sm"
                                >
                                    Delete
                                </Button>
                            </Stack>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            </Flex>
            {/* modal remove post */}
            {isOpen && (
                <ModalComponent
                    type="remove"
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={onClose}
                    handleSubmit={handleRemovePost}
                    isLoading={removePostLoading}
                    title="Remove Post"
                    body="Do you want to remove this Post?"
                    btn="Remove"
                />
            )}
        </>
    )
}

const Post: React.FC = () => {
    const [posts, setPosts] = useState([])
    useQuery(GET_ALL_POSTS, {
        onCompleted({ getAllPosts }) {
            setPosts(getAllPosts.data)
        },
        fetchPolicy: "cache-and-network",
    })
    const navigate = useNavigate()

    // CHAKRA COLOR
    const bgColor = useColorModeValue("white", "gray.700")
    const textColor = useColorModeValue("gray.800", "white")

    return (
        <>
            {!posts.length ? (
                <VStack spacing="4">
                    <Text fontSize="lg" align="center" color="blue.500">
                        You have no any post!
                    </Text>
                    <Button
                        onClick={() => navigate("/post/create")}
                        rightIcon={<VscAdd />}
                        size="sm"
                        colorScheme="green"
                    >
                        Add New
                    </Button>
                </VStack>
            ) : (
                <SimpleGrid columns={[1, 2, 4]} mt="4" spacing="2">
                    {posts &&
                        posts.map((item: IPostData, index: number) => (
                            <PostCard key={index} bgColor={bgColor} textColor={textColor} data={item} />
                        ))}
                </SimpleGrid>
            )}
        </>
    )
}

export default Post
