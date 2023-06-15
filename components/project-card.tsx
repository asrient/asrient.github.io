import Avatar from './avatar'
import DateFormatter from './date-formatter'
import Image from 'next/image'
import Link from 'next/link'
import { toTitleCase, themed } from '../lib/utils'

type Props = {
  name: string
  tagline: string
  accentColor: string
  link: string
  iconPath: string,
}

const ProjectCard = ({
  name,
  tagline,
  accentColor,
  link,
  iconPath,
}: Props) => {

  const thm = themed(accentColor);

  return (
    <Link href={link} className={thm`p-5 md:p-6 $bg-accent-4 rounded-3xl h-48 w-full flex flex-col justify-end hover:shadow-md transition-shadow duration-500`}>
      <div className="pb-1">
        <Image src={iconPath} height={50} width={50} alt={name+' project icon'} />
      </div>
      <h3 className="text-xl mb-1 leading-snug font-bold">
        {name}
      </h3>
      <p className="text-sm leading-relaxed">{tagline}</p>
    </Link>
  )
}

export default ProjectCard