import type ProjectConfigType from '../../interfaces/projectConfig';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CardFrame } from './card-frame';

export const HomenetCard = ({ project }: {
  project: ProjectConfigType;
}) => {

  const ref1 = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref1,
    offset: ["start center", "end center"],
  });

  const color1 = useTransform(
    scrollYProgress,
    [0, 1],
    ['#B48DE5', '#F38E18'],
    {
      clamp: false,
    }
  );

  const color2 = useTransform(
    scrollYProgress,
    [0, 0.8],
    ['#8DCBE5', '#FB1E00'],
    {
      clamp: false,
    }
  );

  const color3 = useTransform(
    scrollYProgress,
    [0, 1],
    ['#8DE596', '#1B91FF'],
    {
      clamp: false,
    }
  );

  return (
    <CardFrame ref={ref1} style={{ backgroundColor: '#173B47' }}>
      <motion.div className='h-28 w-28 rounded-full blur-[80px] absolute bottom-20 left-[10%] md:left-[40%]' style={{
        backgroundColor: color1,
      }}></motion.div>
      <motion.div className='h-28 w-28 md:h-[10rem] md:w-[10rem] rounded-full blur-[90px] absolute bottom-28 left-[50%]' style={{
        backgroundColor: color2,
      }}></motion.div>
      <motion.div className='h-28 w-28 md:h-[10rem] md:w-[10rem] rounded-full blur-[70px] md:blur-[100px] absolute bottom-[50%] md:bottom-[8rem] right-[10%]' style={{
        backgroundColor: color3,
      }}></motion.div>
      <div className='flex flex-col md:flex-row justify-center items-center px-5 py-16 min-h-[34rem] w-full dark relative z-10'>
        <div className='flex justify-center items-center w-full md:w-[25rem] md:max-w-[50%] p-8'>
          <Image src={project.iconPath} height={200} width={200} alt={project.name + ' project icon'} />
        </div>
        <div>
          <h1 className='text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#93D3DB] to-[#296FD8] w-min'>{project.title}</h1>
          <p className='text-3xl md:text-4xl font-bold py-5 max-w-2xl text-neutral-100 text-brand'>{project.tagline}</p>
          <Link href={`/${project.name.toLowerCase()}`} className='buttonPrimaryRound'>
            Learn more
          </Link>
        </div>
      </div>
    </CardFrame>
  );
};
