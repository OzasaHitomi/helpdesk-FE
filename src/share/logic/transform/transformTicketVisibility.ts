import { type TicketVisibility } from '@/share/types/ticketVisibility'

export const transformTicketVisibilityJa = (targetVisibility: TicketVisibility): string => {
  switch (targetVisibility) {
    case 'public':
      return '公開'
    case 'private':
      return '非公開'
    default:
      return ''
  }
}
