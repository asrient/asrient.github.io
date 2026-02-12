import Container from './container'
import { SOCIALS } from '../lib/constants'
import Image from 'next/image'

const Contacts = () => {
    return (
        <div className='bg-neutral-200 dark:bg-neutral-900'>
            <div className='container mx-auto px-0 py-24 sm:py-32'>
                <div className='px-5'>
                    <h2 className='text-7xl md:text-8xl font-thin text-gray-700 dark:text-gray-400 max-w-3xl text-brand'>
                            Asrient's Studio.
                    </h2>
                </div>
                <div className='flex items-end pt-5 sm:pt-10'>
                    <div className='flex flex-col justify-start mt-4 w-full pl-4 md:pl-8'>
                        {Object.keys(SOCIALS).map((social) => (
                            <a key={social} href={SOCIALS[social]} target='_blank' className='transition delay-100 max-w-[20rem] pt-2 pl-2 text-neutral-900 dark:text-neutral-400 font-thin flex items-center group hover:bg-zinc-100 hover:dark:bg-neutral-800'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4 group-hover:scale-125 group-hover:text-[#c97356] mr-2 mb-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                                </svg>
                                <div className='pb-2 border-b border-neutral-900 dark:border-neutral-500 group-hover:border-zinc-100/50 border-opacity-40 w-full'>
                                    {social}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contacts
