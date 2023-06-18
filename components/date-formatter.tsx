import { parseISO, format } from 'date-fns'
import { useEffect, useState } from 'react'

type Props = {
  dateString: string
}

const DateFormatter = ({ dateString }: Props) => {
  const [formatedDateString, setFormatedDateString] = useState('A while ago');

  useEffect(() => {
    setFormatedDateString(format(parseISO(dateString), 'LLLL	d, yyyy'));
  }, [dateString]);

  return <time dateTime={dateString}>{formatedDateString}</time>
}

export default DateFormatter
