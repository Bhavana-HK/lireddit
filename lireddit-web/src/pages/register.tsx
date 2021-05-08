import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { InputField } from 'src/components/InputField';
import { Wrapper } from 'src/components/Wrapper';
import { useRegisterMutation } from 'src/generated/graphql';

/**
 * 1. create the mutation in the graphql playground.
 * 2. paste it in src/graphql/mutations
 * 3. run yarn gen to generate the types (generated/graphql.tsx)
 * 4. this will also create a hook (useRegisterMutation)
 * 5. now the requests and resoponses are typesafe
 */

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const [, register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(values) => {
          return register(values);
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

export default Register;
