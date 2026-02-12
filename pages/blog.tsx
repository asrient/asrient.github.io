import Container from '../components/container'
import MoreStories from '../components/more-stories'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'
import { BRAND_NAME, NAME } from '../lib/constants'
import Post from '../interfaces/post'
import { getDefaultStaticProps } from '../lib/utils'

type Props = {
  allPosts: Post[],
  theme: string,
}

export default function Blog({ allPosts, theme }: Props) {
  return (
    <>
      <Head>
        <title>{`Journal | ${BRAND_NAME}`}</title>
      </Head>
      <Container>
        {allPosts.length > 0 ? <MoreStories title={NAME + "'s journal"} posts={allPosts} /> : <div>
          <h1 className='text-center text-2xl pt-10'>Coming Soon</h1>
          </div>}
      </Container>
    </>
  )
}

export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
  ]);

  return {
    props: {
      ...getDefaultStaticProps(),
      allPosts,
    },
  }
}
