import PostPreview from './post-preview'
import type Post from '../interfaces/post'
import SectionTitle from './section-title'

type Props = {
  posts: Post[],
  title?: string
}

const MoreStories = ({ posts, title }: Props) => {
  return (
    <section className='pt-10'>
      <SectionTitle>
        {title || 'Blog Posts'}
      </SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 pb-32">
        {posts.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            slug={post.slug}
            excerpt={post.excerpt}
          />
        ))}
      </div>
    </section>
  )
}

export default MoreStories
