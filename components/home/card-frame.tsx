import { forwardRef } from 'react';

export const CardFrame = forwardRef(({ children, style }: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}, ref: React.RefObject<HTMLDivElement>) => (
  <section ref={ref} className='bg-white dark:bg-neutral-900 overflow-hidden rounded-3xl shadow-md p-4 mx-4 md:mx-10 2xl:mx-auto my-10 min-h-[30rem] max-w-[1530px] relative' style={style}>
    {children}
  </section>
));
