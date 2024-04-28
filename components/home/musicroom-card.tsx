import type ProjectConfigType from '../../interfaces/projectConfig';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { IPhoneFrameResponsive } from '../iphone-frame';
import { CardFrame } from './card-frame';

export const MusicroomCard = ({ project }: {
  project: ProjectConfigType;
}) => {

  const ref1 = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref1,
  });

  const y1 = useTransform(
    scrollYProgress,
    [0, 1],
    ['-110px', '0px'],
    {
      clamp: false,
    }
  );

  return (
    <CardFrame ref={ref1} style={{ backgroundColor: '#E2DCC7', minHeight: '50rem' }}>
      <div className='flex flex-col justify-center items-center px-5 py-16 h-full w-full'>
        <div className="pb-6">
          <Image src={project.iconPath} height={50} width={50} alt={project.name + ' project icon'} />
        </div>
        <h1 className='text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#422F4E] to-[#6E219E]'>{project.title}</h1>
        <p className='text-3xl md:text-4xl font-bold py-7 mx-auto max-w-3xl text-center text-neutral-900 text-brand'>{project.tagline}</p>
        <div className='flex flex-row justify-center items-center'>
          <Link href={`/${project.name.toLowerCase()}`} className='buttonPrimaryRoundBlack'>
            Learn more
          </Link>
        </div>
        <div className='pt-28 flex gap-x-2 md:gap-x-8'>
          <motion.div style={{
            y: y1,
          }}>
            <IPhoneFrameResponsive img='/assets/img/mr-ss1.jpg' width={180} widthMd={300} />
          </motion.div>

          <IPhoneFrameResponsive img='/assets/img/mr-ss2.jpg' width={180} widthMd={300} />
          <motion.div style={{
            y: y1,
          }}>
            <IPhoneFrameResponsive img='/assets/img/mr-ss3.jpg' width={180} widthMd={300} />
          </motion.div>
        </div>
      </div>
    </CardFrame>
  );
};
