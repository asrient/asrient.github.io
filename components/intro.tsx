import { BRAND_NAME, REAL_NAME, INTRO, SOCIALS } from '../lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import { toTitleCase, themed } from '../lib/utils'

const Intro = ({ theme }: {
  theme: string
}) => {

  const thm = themed(theme);

  return (
    <section className="flex-col md:flex-row flex items-center md:justify-center max-w-5xl mx-auto pt-16 pb-16 md:pb-12">
      <div className="md:pr-8 flex justify-center items-center lg:w-1/3">
        <Image
          src="/assets/icon/dp.jpeg"
          width={100}
          height={100}
          className='mr-4 border-2 border-gray-200 dark:border-gray-800 rounded-full'
          alt="Profile Picture"
        />
        <div className='h-max'>
          <div className='text-3xl md:text-4xl lg:text-6xl font-medium font-serif leading-normal'>
            {BRAND_NAME}
          </div>
          <div className='italic text-red-500 font-light'>
            aka. {REAL_NAME}
          </div>
        </div>
      </div>
      <h4 className="text-left text-lg mt-5 md:pl-8 lg:pl-10 md:max-w-[50vw] font-serif">
        <span dangerouslySetInnerHTML={{ __html: INTRO }}></span>
        <div className='pt-4 leading-relaxed'>
          Also find me on:
          <div className={thm`flex flex-row $text-accent-3 dark:$text-accent-2 font-semibold`}>
            {
              Object.keys(SOCIALS).map((social) => {
                return (
                  <Link href={SOCIALS[social]} target="_blank" key={social} className='mr-4 hover:underline'>{toTitleCase(social)}</Link>
                )
              })
            }
          </div>
        </div>
      </h4>
    </section>
  )
}

export default Intro
