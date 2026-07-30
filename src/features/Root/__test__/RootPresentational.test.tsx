import { RootPresentational } from '../RootPresentational'
import { CreateTicketDialog } from '../ui/CreateTicketDialog'
import { TicketsTable } from '../ui/TicketsTable'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { type CreateTicketForm } from '../types/CreateTicketForm'
import { type TicketFieldErrors } from '@/features/Root/types/TicketFieldErrors'
import { type TicketItemView } from '../types/TicketItemView'

// RootPresentationalの表示内容（見出し・新規作成ボタンの出し分け・チケット一覧テーブルへの橋渡し）のみをテストする
// （CreateTicketDialog自体の見た目・操作はCreateTicketDialog.test.tsx、TicketsTable自体の見た目はTicketsTable.test.tsxが担保する）

vi.mock('../ui/CreateTicketDialog', () => ({
  CreateTicketDialog: vi.fn(() => <div data-testid='mocked-create-ticket-dialog' />),
}))

vi.mock('../ui/TicketsTable', () => ({
  TicketsTable: vi.fn(() => <div data-testid='mocked-ticket-table' />),
}))

const mockCreateTicketDialog = vi.mocked(CreateTicketDialog)
const mockTicketsTable = vi.mocked(TicketsTable)

const mockTicketForm: CreateTicketForm = { title: '', detail: '', visibility: 'private' }
const mockFieldErrors: TicketFieldErrors = {}
const mockTickets: TicketItemView[] = [
  {
    id: 1,
    title: 'ログインできない',
    visibility: 'private',
    status: 'new_question',
    createdAt: new Date('2026-07-29T00:00:00Z'),
    questionerName: '山田太郎',
    supportUserName: null,
  },
]
const mockOnSubmitTicket = vi.fn()
const mockSetTicketForm = vi.fn()
const mockOnOpenDialog = vi.fn()
const mockOnCloseDialog = vi.fn()

const renderPresentational = (role: 'employee' | 'support' | 'admin' | undefined) => {
  customRender(
    <RootPresentational
      data={{
        role,
        ticketForm: mockTicketForm,
        isDialogOpen: false,
        fieldErrors: mockFieldErrors,
        tickets: mockTickets,
      }}
      uiState={{ isSubmitting: false }}
      handlers={{
        onSubmitTicket: mockOnSubmitTicket,
        setTicketForm: mockSetTicketForm,
        onOpenDialog: mockOnOpenDialog,
        onCloseDialog: mockOnCloseDialog,
      }}
    />,
  )
}

describe('RootPresentational', () => {
  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('見出し「Tickets」が表示されること', () => {
      renderPresentational('employee')
      expect(screen.getByText('Tickets')).toBeInTheDocument()
    })

    it('roleがemployeeの場合、新規チケット作成ダイアログが表示されること', () => {
      renderPresentational('employee')
      expect(screen.getByTestId('mocked-create-ticket-dialog')).toBeInTheDocument()
    })

    it('CreateTicketDialogにdata/uiState/handlersがそのまま渡されること', () => {
      renderPresentational('employee')
      expect(mockCreateTicketDialog).toHaveBeenCalledWith(
        {
          data: { ticketForm: mockTicketForm, isDialogOpen: false, fieldErrors: mockFieldErrors },
          uiState: { isSubmitting: false },
          handlers: {
            onSubmitTicket: mockOnSubmitTicket,
            setTicketForm: mockSetTicketForm,
            onOpenDialog: mockOnOpenDialog,
            onCloseDialog: mockOnCloseDialog,
          },
        },
        undefined,
      )
    })

    it('TicketsTableが表示され、ticketsがそのまま渡されること', () => {
      renderPresentational('employee')
      expect(screen.getByTestId('mocked-ticket-table')).toBeInTheDocument()
      expect(mockTicketsTable).toHaveBeenCalledWith({ tickets: mockTickets }, undefined)
    })
  })

  // ── 準正常系（employee以外はダイアログを出さない、という表示の出し分け） ──
  describe('準正常系', () => {
    it('roleがsupportの場合、新規チケット作成ダイアログが表示されないこと', () => {
      renderPresentational('support')
      expect(screen.queryByTestId('mocked-create-ticket-dialog')).not.toBeInTheDocument()
    })

    it('roleがadminの場合、新規チケット作成ダイアログが表示されないこと', () => {
      renderPresentational('admin')
      expect(screen.queryByTestId('mocked-create-ticket-dialog')).not.toBeInTheDocument()
    })

    it('roleがundefined(未取得)の場合、新規チケット作成ダイアログが表示されないこと', () => {
      renderPresentational(undefined)
      expect(screen.queryByTestId('mocked-create-ticket-dialog')).not.toBeInTheDocument()
    })
  })
})
