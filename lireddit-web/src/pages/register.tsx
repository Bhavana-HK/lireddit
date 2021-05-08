import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { InputField } from 'src/components/InputField';
import { Wrapper } from 'src/components/Wrapper';
import { useMutation } from 'urql';

const REGISTER_MUT = `mutation Register($username: String!, $password: String!){
    register(options: { username: $username, password: $password }) {
      errors {
        field
        message
      }
      user {
        id
        username
      }
    }
  }
  `;

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const [, register] = useMutation(REGISTER_MUT);
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
