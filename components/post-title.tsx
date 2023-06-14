import { ReactNode } from 'react'

type Props = {
  children?: ReactNode
}

const PostTitle = ({ children }: Props) => {
  return (
    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight md:leading-none py-12 text-center md:text-left">
      {children}
    </h1>
  )
}

export default PostTitle
