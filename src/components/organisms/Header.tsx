import { Box, Container, HStack, Spacer, Heading, Link, Text, Button } from '@chakra-ui/react'
import { SYSTEM_NAME } from '@/share/constants/business/systemName'
import { type UserRole } from '@/share/types/userRole'

interface HeaderProps {
  data: {
    role: UserRole | undefined
    isLoggingOut: boolean
  }
  handlers: {
    onLogout: () => Promise<void>
  }
}

export const Header = ({ data, handlers }: HeaderProps) => {
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
              {/* 右側要素をまとめるHStack。管理者のみAccountリンクを追加表示する */}
              <HStack gap={{ base: 4, md: 8 }}>
                {/* ↓Account・｜・Ticketは他要素より間隔を詰めたいため、専用のgapを持つHStackでまとめる */}
                <HStack gap={2}>
                  {/* ↓管理者のみアカウント管理画面（'/accounts'）へのリンクと、Ticketとの区切り線を表示する */}
                  {data.role === 'admin' && (
                    <>
                      <Link href={'/accounts'} _hover={{ textDecoration: 'none' }}>
                        <Text fontSize={{ base: 'sm', sm: 'md', md: 'lg' }} color={'gray.500'}>
                          Account
                        </Text>
                      </Link>
                      <Text fontSize={{ base: 'sm', sm: 'md', md: 'lg' }} color={'gray.500'}>
                        ｜
                      </Text>
                    </>
                  )}
                  {/* ↓Ticketクリックでチケット一覧のTopページ（'/'）に遷移する。システム名クリック時と同様の遷移方法 */}
                  <Link href={'/'} _hover={{ textDecoration: 'none' }}>
                    <Text fontSize={{ base: 'sm', sm: 'md', md: 'lg' }} color={'gray.500'}>
                      Ticket
                    </Text>
                  </Link>
                </HStack>
                {/* ↓Logoutはページ遷移ではなく処理（ログアウトAPI呼び出し）を実行するため、Linkではなく処理実行用のButtonを使う */}
                <Button
                  variant={'plain'} // ↓ボタンの装飾(背景色や枠線)を消して、文字だけのシンプルな見た目にする
                  h={'auto'} // ↓高さをボタンの既定値でなく中身の文字サイズに合わせる
                  p={0} // ↓内側の余白をなくし、隣のTicketリンクと見た目を揃える
                  fontWeight={'normal'} // ↓ボタンの太字表示をやめて、隣のTicketリンクと同じ太さにする
                  fontSize={{ base: 'sm', sm: 'md', md: 'lg' }} // ↓画面幅に応じて文字サイズを変える
                  color={'gray.500'} // ↓文字色を隣のTicketリンクと揃える
                  // ↓ログアウト処理中は連打できないようボタンを無効化する
                  // （連打を許すとログアウトAPIが複数回呼ばれ、画面遷移やトースト表示が重複する恐れがあるため）
                  disabled={data.isLoggingOut}
                  onClick={() => {
                    void handlers.onLogout() // ↓クリックでログアウト処理を実行する
                  }}
                >
                  Logout
                </Button>
              </HStack>
            </HStack>
          </Container>
        </Box>
      </header>
    </>
  )
}
