
export const IPhoneFrame = ({ img, width }: {
    img: string
    width?: number
}) => {

    width = width || 520

    const zoomFactor = width / 520
    const height = zoomFactor * 1052

    return (<div className='relative overflow-hidden' style={{
        width: width,
        height: height,
    }}>
        <div className='absolute top-0 left-0 w-full h-full bg-no-repeat bg-contain bg-center' style={{
            backgroundImage: `url(${img})`,
            backgroundSize: `${width - zoomFactor * 55}px ${height - zoomFactor * 55}px`,
            borderRadius: `${zoomFactor * 110}px`,
        }}>
        </div>
        <div className='absolute top-0 left-0 h-full w-full bg-iphone-frame bg-contain bg-center bg-no-repeat'></div>
    </div>)
}
export const IPhoneFrameResponsive = ({ img, width, widthSm, widthMd }: {
    img: string
    width?: number
    widthSm?: number
    widthMd?: number
}) => {

    width = width || 300
    widthSm = widthSm || width
    widthMd = widthMd || widthSm

    return (
        <>
            <div className='hidden md:block'>
                <IPhoneFrame img={img} width={widthMd} />
            </div>
            <div className='hidden sm:block md:hidden'>
                <IPhoneFrame img={img} width={widthSm} />
            </div>
            <div className='sm:hidden'>
                <IPhoneFrame img={img} width={width} />
            </div>
        </>
    )
}
