// Presentational: 実際の画面表示を担当する層 / Containerから受け取ったdata/uiStateをそのまま子コンポーネントに渡すだけで、自分で通信したりstateを持ったりはしない
import { Center, Heading, Text, VStack } from '@chakra-ui/react'

export const NotFoundPagePresentational = () => {
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
