import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { useRouter } from 'next/router';
import { isServer } from 'src/utils/isServer';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  // pause is set to true when its server because we dont want to server side render the 'me' query
  const [{ data }] = useMeQuery({ pause: isServer() });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    const response = await logout();
    if (response.data?.logout) router.push('/');
  };

  let body = null;
  if (!data?.me) {
    body = (
      <>
        <NextLink href={'/login'}>
          <Link mr={2} color={'white'}>
            login
          </Link>
        </NextLink>
        <NextLink href={'/register'}>
          <Link color={'white'}>register</Link>
        </NextLink>
      </>
    );
  } else if (data.me) {
    body = (
      <Flex>
        <Box color="white" mr={2}>
          {data.me.username}
        </Box>
        <Button
          variant={'link'}
          onClick={handleLogout}
          isLoading={logoutFetching}
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex p={4} bgColor="teal">
      <Box ml={'auto'}>{body}</Box>
    </Flex>
  );
};
