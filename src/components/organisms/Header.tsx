import { Box, Container, HStack, Spacer, Heading } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { SYSTEM_NAME } from '@/share/constants/business/systemName'

export const Header = () => {
  const navigate = useNavigate()

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
              <Heading
                size={{ base: 'lg', sm: 'xl', md: '2xl' }}
                as={'h1'}
                color={'gray.500'}
                cursor={'pointer'}
                onClick={() => {
                  // ↓システム名クリックでTopページ（チケット一覧, '/'）に遷移する。アカウントタイプによる遷移先の分岐は無し
                  void navigate('/')
                }}
              >
                {SYSTEM_NAME}
              </Heading>
              <Spacer />
              {/* 右側に複数要素を並べる場合、それらをまとめる HStack spacing={...} などでグループ化しておくと、要素間の間隔調整がしやすくなる */}
              {/* ここに右側要素を追加していく */}
            </HStack>
          </Container>
        </Box>
      </header>
    </>
  )
}
