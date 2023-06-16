import cn from 'classnames'
import Link from 'next/link'
import Image from 'next/image'

type Props = {
  title: string
  src: string
  slug?: string
  full?: boolean
}

const CoverImage = ({ title, src, slug, full }: Props) => {
  const image = (
    <Image
      src={src}
      alt={`Cover Image for ${title}`}
      className={cn('shadow-sm w-full', {
        'hover:shadow-lg transition-shadow duration-200': slug,
        'h-[25rem] lg:h-[630px]': !!full,
        'h-[15rem] lg:h-[300px]': !full,
      })}
      width={full ? 1300 : 550}
      height={full ? 630 : 300}
      style={{ objectFit: 'cover' }}
    />
  )
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link as={`/posts/${slug}`} href="/posts/[slug]" aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  )
}

export default CoverImage
