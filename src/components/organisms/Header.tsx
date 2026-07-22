import { Box, Container, HStack, Spacer, Heading, Link, Text } from '@chakra-ui/react'
import { SYSTEM_NAME } from '@/share/constants/business/systemName'

export const Header = () => {
  return (
    <>
      <header>
        <Box h={'64px'} borderBottom={'1px solid'} borderColor={'gray.200'}>
          {/* ↓paddingをブレークポイントごとに細分化し、画面幅に応じて余白の比率が滑らかに変化するようにする */}
          <Container h={'100%'} px={{ base: 4, sm: 6, md: 12, lg: 20, xl: 32 }}>
            {/* ↓設定していない場合、要素の幅になる */}
            <HStack h={'100%'}>
              {/* ↓もともとh2の要素 */}
              {/* ↓文字サイズもブレークポイントごとに変化させ、画面幅との比率を保つ */}
              <Heading size={{ base: 'lg', sm: 'xl', md: '2xl' }} as={'h1'} color={'gray.500'}>
                {/* ↓システム名クリックでTopページ（チケット一覧, '/'）に遷移する。アカウントタイプによる遷移先の分岐は無し */}
                <Link href={'/'} _hover={{ textDecoration: 'none' }}>
                  {SYSTEM_NAME}
                </Link>
              </Heading>
              <Spacer />
              {/* 右側要素をまとめるHStack。将来的に社員/サポート担当は「Ticket Logout」、管理者は「Account | Ticket Logout」を表示する想定 */}
              <HStack gap={{ base: 4, md: 8 }}>
                {/* ↓Ticketクリックでチケット一覧のTopページ（'/'）に遷移する。システム名クリック時と同様の遷移方法 */}
                <Link href={'/'} _hover={{ textDecoration: 'none' }}>
                  <Text fontSize={{ base: 'sm', sm: 'md', md: 'lg' }} color={'gray.500'}>
                    Ticket
                  </Text>
                </Link>
                {/* ↓BEのログアウト機能がレビュー中のため、表示のみ追加。機能実装は別途対応 */}
                <Text fontSize={{ base: 'sm', sm: 'md', md: 'lg' }} color={'gray.500'}>
                  Logout
                </Text>
              </HStack>
            </HStack>
          </Container>
        </Box>
      </header>
    </>
  )
}
