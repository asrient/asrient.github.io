import type ProjectConfigType from '../../interfaces/projectConfig';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform, circOut } from 'framer-motion';
import { CardFrame } from './card-frame';

export const HomecloudCard = ({ project }: {
  project: ProjectConfigType;
}) => {

  const initialPositions = [
    [-150, 140, 1],
    [190, 100, 1.3],
    [-120, 10, 0.95],
    [200, -60, 1.42],
    [88, -20, 1],
    [-200, 46, 1.2],
    [115, -130, 1.3],
    [255, -10, 0.85],
    [-33, -128, 1.1],
    [-178, -95, 1.4],
  ];

  const ref1 = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref1,
  });

  const parallexY = useTransform(
    scrollYProgress,
    [0, 1],
    ['-130px', '0px'],
    {
      clamp: false,
    }
  );

  const bubbles = [];
  for (let i = 1; i <= 10; i++) {
    bubbles.push({
      key: i,
      img: `/assets/img/hc-bubbles/${i}.png`,
      y: useTransform(
        scrollYProgress,
        [0, 1],
        ['0px', `${initialPositions[i - 1][1]}px`],
        { ease: circOut }
      ),
      x: useTransform(
        scrollYProgress,
        [0, 1],
        ['0px', `${initialPositions[i - 1][0]}px`],
        { ease: circOut }
      ),
      scale: useTransform(
        scrollYProgress,
        [0, 1],
        [0.6, initialPositions[i - 1][2]]
      ),
    });
  }

  return (
    <CardFrame>
      <div ref={ref1} className='mt-8 flex justify-center items-center min-h-[27rem] relative'>
        {bubbles.map((bubble) => (
          <motion.span key={bubble.key} className='absolute top-auto left-auto' style={{
            x: bubble.x,
            y: bubble.y,
            scale: bubble.scale,
          }}>
            <Image src={bubble.img} height={80} width={80} alt='bubble' />
          </motion.span>
        ))}
        <Image className='absolute top-auto left-auto' src={project.iconPath} height={130} width={130} alt={project.name + ' project icon'} />
      </div>
      <motion.div className='flex flex-col items-center py-16 h-full w-full relative top-0' style={{
        top: parallexY,
      }}>
        <h1 className='text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r dark:from-[#ffb597] to-[#9E3F21] from-[#4E382F] dark:to-[#9E3F21] w-min'>{project.title}</h1>
        <p className='text-3xl md:text-4xl font-bold py-7 md:max-w-3xl text-center text-neutral-900 dark:text-neutral-100 text-brand'>{project.tagline}</p>
        <Link href={`/${project.name.toLowerCase()}`} className='buttonPrimaryRound'>
          Learn more
        </Link>
      </motion.div>
    </CardFrame>
  );
};
