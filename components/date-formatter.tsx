import { parseISO, format } from 'date-fns'

type Props = {
  dateString: string
}

const DateFormatter = ({ dateString }: Props) => {
  //const date = parseISO(dateString)
  return <time dateTime={dateString}>123</time>
}

export default DateFormatter
