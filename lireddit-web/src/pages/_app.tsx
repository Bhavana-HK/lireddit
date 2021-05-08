import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import React from 'react';
import { client } from '../client';
import { Provider } from 'urql';

import theme from '../theme';

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
