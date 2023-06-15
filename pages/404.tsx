import Head from 'next/head'

export default function Custom404() {
    return <div>
        <Head>
            <title>404 - Page not found</title>
        </Head>
        <h1 className="text-2xl text-black dark:text-white flex flex-col text-center items-center pt-32">
            <div className='text-8xl text-gray-600 font-thin leading-relaxed'>404</div>
            <div>Sorry, we couldn't find the page you are looking for.</div>
        </h1>
    </div>
}
