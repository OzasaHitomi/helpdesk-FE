// ci設定時にvitestの動作確認のために作成したファイルです

import { describe, expect, it } from 'vitest'
import { add } from '../sample'

describe('add', () => {
  it('2つの数値を正しく加算できる', () => {
    expect(add(1, 2)).toBe(3)
  })
})
