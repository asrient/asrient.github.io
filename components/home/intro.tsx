import { BRAND_NAME, INTRO } from '../../lib/constants'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const Intro = ({ theme }: {
  theme: string
}) => {

  const ref1 = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref1,
  });

  const height = useTransform(
    scrollYProgress,
    [0.3, 1],
    ['25rem', '100%']
  )

  const y = useTransform(
    scrollYProgress,
    [0.3, 1],
    ['38vh', '0vh']
  )

  const textY = useTransform(
    scrollYProgress,
    [0.35, 0.6, 1],
    ['0vh', '8vh', '15vh']
  )

  return (
    <section ref={ref1} className='relative h-[60rem] min-h-[140vh] bg-[#D36527]'>
      <motion.div
        className='absolute top-0 left-0 w-full flex justify-center items-center bg-homepage-hero-1 bg-no-repeat bg-center bg-cover'
        style={{ height, y }}>
        <motion.div className='text-white text-opacity-60 text-4xl md:text-7xl font-bold px-2 text-center relative' style={{ top: textY }}>
          Studio by {BRAND_NAME}
        </motion.div>
      </motion.div>
      <div className='absolute bottom-16 px-5 md:px-12 py-8 md:py-16 text-white text-opacity-80 text-xs left-0 w-full'>
        <div className='max-w-[1600px] mx-auto'>
          <div className='md:max-w-[30rem]'>
            {INTRO}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Intro
