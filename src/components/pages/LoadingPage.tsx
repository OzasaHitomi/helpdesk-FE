import { Center, Spinner } from '@chakra-ui/react'

export const LoadingPage = () => {
  return (
    <Center h={'100vh'}>
      {/* roleはChakraのSpinnerにデフォルトでは付かないため明示的に指定している（テストのgetByRole('status')で参照） */}
      <Spinner size={'xl'} role={'status'} />
    </Center>
  )
}
