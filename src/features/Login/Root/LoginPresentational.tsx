import { Box, Button, Card, Container, Field, Input, Stack, Text } from '@chakra-ui/react'
import { type LoginForm } from './types/LoginForm'
import { SYSTEM_NAME } from '@/share/constants/business/systemName'

interface LoginPresentationalProps {
  data: {
    loginForm: LoginForm
    errorMessage: string | null
  }
  handlers: {
    onSubmitLogin: (data: LoginForm) => Promise<void>
    setLoginForm: (data: LoginForm) => void
  }
}

export const LoginPresentational = ({ data, handlers }: LoginPresentationalProps) => {
  return (
    <Box bg={'gray.200'} minH={'100vh'}>
      <Container h={'100vh'} centerContent justifyContent={'center'}>
        <Card.Root w={'100%'} maxW={'560px'} bg={'gray.100'} borderRadius={'32px'}>
          <Card.Header px={10} pt={8}>
            <Card.Title fontSize={'lg'} textAlign={'center'}>
              {SYSTEM_NAME}
            </Card.Title>
          </Card.Header>

          <Card.Body px={10} pb={8}>
            <Stack gap={6}>
              <Box bg={'white'} borderRadius={'32px'} p={8}>
                <Stack gap={4}>
                  <Field.Root orientation={'horizontal'}>
                    <Field.Label>Email</Field.Label>
                    <Input
                      type='email'
                      placeholder='sample@example.com'
                      borderRadius={'12px'}
                      value={data.loginForm.email}
                      onChange={(e) => {
                        handlers.setLoginForm({ ...data.loginForm, email: e.target.value })
                      }}
                    />
                  </Field.Root>

                  <Field.Root orientation={'horizontal'}>
                    <Field.Label>Pass</Field.Label>
                    <Input
                      type='password'
                      placeholder='password'
                      borderRadius={'12px'}
                      value={data.loginForm.password}
                      onChange={(e) => {
                        handlers.setLoginForm({ ...data.loginForm, password: e.target.value })
                      }}
                    />
                  </Field.Root>

                  <Button
                    w={'100%'}
                    bg={'#85d147'}
                    color={'white'}
                    fontWeight={'bold'}
                    onClick={() => {
                      void handlers.onSubmitLogin(data.loginForm)
                    }}
                  >
                    ログイン
                  </Button>
                </Stack>
              </Box>

              {data.errorMessage && (
                <Text color={'red.500'} fontSize={'sm'} whiteSpace={'pre-line'}>
                  {data.errorMessage}
                </Text>
              )}
            </Stack>
          </Card.Body>
        </Card.Root>
      </Container>
    </Box>
  )
}
