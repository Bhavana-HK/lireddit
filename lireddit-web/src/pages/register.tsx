import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

/**
 * 1. create the mutation in the graphql playground.
 * 2. paste it in src/graphql/mutations
 * 3. run yarn gen to generate the types (generated/graphql.tsx)
 * 4. this will also create a hook (useRegisterMutation)
 * 5. now the requests and resoponses are typesafe
 */

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, actions) => {
          const response = await register({options: values});
          if (response.data?.register.errors) {
            actions.setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            router.push('/');
          }
        }}
      >
        {(props) => (
          <Form>
            <InputField
              label={'Username'}
              name={'username'}
              placeholder={'username'}
            />
            <Box mt={4}>
              <InputField
                label={'Password'}
                name={'password'}
                placeholder={'password'}
                type={'password'}
              />
            </Box>
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={props.isSubmitting}
              type="submit"
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

// no server side rendering for this page
export default withUrqlClient(createUrqlClient)(Register);
