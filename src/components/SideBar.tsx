'use client';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSollinked } from '@sollinked/sdk';
import { useMemo } from 'react';
import moment from 'moment';

type LinkParams = {
    link: string;
    text: string;
    active?: boolean;
    notification?: boolean;
  }
  
const SideBarItem = ({ link, text, active, notification }: LinkParams) => {
    return (
      <Link href={link}>
        <div className={`
          w-100 
          ${active? `border-l-[2px] border-indigo-500 text-white`: `border-l-[1px] border-zinc-700 text-slate-500`}
          ml-5 pl-5 py-2 mt-2
          flex flex-row items-center
        `}>
          {text}
          {
            notification &&
            <span className='ml-3 w-2 h-2 rounded-full bg-red-500'></span>
          }
        </div>
      </Link>
    )
}
  
const SideBar = () => {
    const pathname = usePathname();
    let { user } = useSollinked();

    const hasUnrespondedMail = useMemo(() => {
      if(!user) {
        return false;
      }

      if(!user.mails) {
        return false;
      }

      if(user.mails.length === 0) {
        return false;
      }

      return user.mails.filter(x => (
        x.is_processed &&
        x.value_usd &&
        !x.has_responded && 
        !x.is_claimed && 
        moment(x.expiry_date).isAfter(moment())
      )).length > 0;
    }, [ user ]);
  
    return (
      <div className={`
        flex flex-col flex-1 w-1/4 h-screen
        border-r-[0.5px] border-indigo-500
      `}>
        <div className={`
          flex flex-row pl-3 items-center
          bg-slate-700
          h-[60px]
        `}>
          <Image
            src={user.profile_picture ?? "/logo.png"}
            alt="null"
            width={30}
            height={30}
            className={`
               h-10 w-10 rounded-full
            `}
          />
          <strong className='ml-3'>
            { user.display_name? user.display_name : "User" }
          </strong>
        </div>
        <div className="mt-5"></div>
        <SideBarItem
          link="/"
          text="Home"
          active={pathname === "/"}
        />
        <SideBarItem
          link="/email"
          text="Email"
          active={pathname === "/email"}
          notification={hasUnrespondedMail}
        />
        <SideBarItem
          link="/calendar"
          text="Calendar"
          active={pathname === "/calendar"}
        />
        <SideBarItem
          link="/github"
          text="Github"
          active={pathname === "/github"}
        />
        <SideBarItem
          link="/chat"
          text="Chat"
          active={pathname === "/chat"}
        />
        <SideBarItem
          link="/webhooks"
          text="Webhooks"
          active={pathname === "/webhooks"}
        />
        <SideBarItem
          link="/settings"
          text="Settings"
          active={pathname === "/settings"}
        />
      </div>
    )
}

export default SideBar;