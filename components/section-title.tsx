import { ReactNode } from 'react'

type Props = {
  children?: ReactNode
}

const SectionTitle = ({ children }: Props) => {
  return (
    <h2 className='text-3xl sm:text-4xl md:text-5xl font-light mb-6 text-gray-800/80 dark:text-gray-100/70 text-brand uppercase'>
      {children}
    </h2>
  )
}

export default SectionTitle
