import { Center, Heading, Text, VStack } from '@chakra-ui/react'

export const NotFoundPage = () => {
  return (
    <Center h={'100vh'} pb={{ base: 32, md: 48 }}>
      <VStack gap={4}>
        <Heading size={{ base: 'xl', sm: '2xl', md: '3xl' }} color={'gray.500'}>
          404
        </Heading>
        <Text fontSize={{ base: 'sm', sm: 'md', md: 'lg' }} color={'gray.500'}>
          お探しのページが見つかりません
        </Text>
      </VStack>
    </Center>
  )
}
