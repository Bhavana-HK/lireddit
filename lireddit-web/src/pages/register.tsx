import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik, getIn } from 'formik';
import React from 'react';
import { InputField } from 'src/components/InputField';
import { Wrapper } from 'src/components/Wrapper';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(values, actions) => {
          console.log(values, actions);
          actions.setSubmitting(false);
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
