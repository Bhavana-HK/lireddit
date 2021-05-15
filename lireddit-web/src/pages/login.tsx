import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
/**
 * 1. create the mutation in the graphql playground.
 * 2. paste it in src/graphql/mutations
 * 3. run yarn gen to generate the types (generated/graphql.tsx)
 * 4. this will also create a hook (useRegisterMutation)
 * 5. now the requests and resoponses are typesafe
 */

const schema = yup.object({
  usernameOrEmail: yup.string().nullable().required(),
  password: yup.string().nullable().required(),
});

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        validationSchema={schema}
        onSubmit={async (values, actions) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            actions.setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            router.push('/');
          }
        }}
      >
        {(props) => (
          <Form>
            <InputField
              label={'Username Or Email'}
              name={'usernameOrEmail'}
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
              Log In
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

// no server side rendering for this page
export default withUrqlClient(createUrqlClient)(Login);
