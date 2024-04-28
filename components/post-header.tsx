import Avatar from './avatar'
import DateFormatter from './date-formatter'
import CoverImage from './cover-image'
import PostTitle from './post-title'
import type Author from '../interfaces/author'
import Container from './container'

type Props = {
  title: string
  coverImage: string
  date: string
  author: Author
}

const PostHeader = ({ title, coverImage, date, author }: Props) => {
  return (
    <>
      <Container>
        <PostTitle>{title}</PostTitle>
        <div className="flex justify-between items-center mb-6">
        <div>
          <Avatar name={author.name} picture={author.picture} />
        </div>
        <div className="text-lg">
          <DateFormatter dateString={date} />
        </div>
      </div>
      </Container>
      <div className="mb-8 md:mb-16 sm:mx-0">
        <CoverImage
          full={true}
          title={title}
          src={coverImage} />
      </div>
    </>
  )
}

export default PostHeader
