import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { useMeQuery } from '../generated/graphql';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data }] = useMeQuery();
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
        <Box color="white" mr={2}>{data.me.username}</Box>
        <Button variant={'link'}>logout</Button>
      </Flex>
    );
  }
  return (
    <Flex p={4} bgColor="teal">
      <Box ml={'auto'}>
        {body}
      </Box>
    </Flex>
  );
};
