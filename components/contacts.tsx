import Container from './container'
import { SOCIALS } from '../lib/constants'
import Image from 'next/image'

const Contacts = () => {
    return (
        <div className='bg-[#8FACF8] container mx-auto px-0 py-28'>
            <div className='px-5'>
                <h2 className='text-4xl md:text-6xl font-bold text-gray-800 max-w-3xl text-brand'>
                    Make <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#12115E] to-[#A023DA]'>great products</span> together, connect on socials.
                </h2>
            </div>
            <div className='flex items-end pt-16'>
                <div>
                    <Image src='/assets/img/contacts-hero.jpg' width={600} height={0} className='md:h-auto h-[300px] object-cover object-right max-w-[35vw]' alt='Contacts' />
                </div>
                <div className='flex flex-col justify-start mt-4 w-full pl-4 md:pl-8'>
                    {Object.keys(SOCIALS).map((social) => (
                        <a key={social} href={SOCIALS[social]} target='_blank' className='transition delay-100 max-w-[20rem] pt-2 pl-2 text-neutral-900 font-thin flex items-center group hover:bg-zinc-100'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4 group-hover:scale-125 group-hover:text-[#c97356] mr-2 mb-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>
                            <div className='pb-2 border-b border-neutral-900 group-hover:border-zinc-100 border-opacity-40 w-full'>
                                {social}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Contacts
