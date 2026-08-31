// Container: 各hookを呼び出して値を集め、Presentational（見た目）に橋渡しするだけの層 / ここにロジックは書かず、「誰から何を受け取って、誰にそのまま渡すか」だけに専念する
import { NotFoundPagePresentational } from './NotFoundPagePresentational'

export const NotFoundPageContainer = () => {
  return <NotFoundPagePresentational />
}
