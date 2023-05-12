import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';



export default function Login() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()
  let emailRef = useRef()
  let passwordRef = useRef()


  const handleLoginForm = async () => {
    setLoading(true)
    let obj = {
      email: emailRef.current.value,
      password: passwordRef.current.value
    }
    try {
      let data = await fetch(`${import.meta.env.VITE_BASE_URL}/users/login`, {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          "Content-Type": "application/json"
        }
      })
      let res = await data.json()
      setLoading(false)
      localStorage.setItem("loggedin_user", res.token)
      if(res.message=="login successful"){
        toast({
          position:'bottom-right',
          title: res.message,
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        navigate('/')
      }
      else{
        toast({
          position:'bottom-right',
          title: res.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    } catch (err) {
      setLoading(false)
      toast({
        position:'bottom-right',
        title: 'something went wrong.',
        description: err.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={"center"}>Welcome to the Cloud board SJSU</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            Manage your Projects and Tasks with SJSU
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" ref={emailRef} required />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" ref={passwordRef} required />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Link to="/signup">Don't Have an Account</Link>
              </Stack>
              <Button
                bg={'blue.400'}
                color={'white'}
                isLoading={loading}
                onClick={handleLoginForm}
                _hover={{
                  bg: 'blue.500',
                }}>
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}