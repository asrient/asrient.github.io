import { parseISO, format } from 'date-fns'
import { useEffect, useState } from 'react'

type Props = {
  dateString: string
}

const DateFormatter = ({ dateString }: Props) => {
  const [formatedDateString, setFormatedDateString] = useState('A while ago');

  useEffect(() => {
    if (!dateString) return;
    const parsed = parseISO(dateString);
    if (isNaN(parsed.getTime())) return;
    setFormatedDateString(format(parsed, 'LLLL d, yyyy'));
  }, [dateString]);

  return <time dateTime={dateString}>{formatedDateString}</time>
}

export default DateFormatter
