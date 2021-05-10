import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { NavBar } from '../components/NavBar';
import { usePostsQuery } from '../generated/graphql';
import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

const Index = () => {
  const [{ fetching, data }] = usePostsQuery();
  return (
    <>
      <NavBar />
      <div>Hello world</div>
      {fetching ? (
        <Box mb={2} p={2}>
          loading...
        </Box>
      ) : data ? (
        data.posts.map((post) => (
          <Box key={post.id} mb={2} p={2}>
            <Heading size={'xs'}>{post.title}</Heading>
          </Box>
        ))
      ) : (
        <Box mb={2} p={2}>
          No posts found
        </Box>
      )}
    </>
  );
};

// this page is server side rendered. To know if a page is SSR, right click and view page source.
// if the data content is vivisble, its SSR
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
