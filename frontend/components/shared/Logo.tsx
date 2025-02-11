import Image from 'next/image'
import Link from 'next/link'
import React from "react"


const Logo = ({ classname, href }: { classname: string, href: string }) => {
    return (
        <Link href={href} className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" className={classname} width={228} height={214} priority quality={100} />
        </Link>
    )
}

export default Logo