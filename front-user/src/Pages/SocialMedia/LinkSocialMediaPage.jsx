import React from 'react';
import TopBar from '../../Components/Layout/TopBar';
import Telegram_Link from '../../Components/SocialMedia/SocialMediaLink/Telegram_Link';
import Facebook_Link from '../../Components/SocialMedia/SocialMediaLink/Facebook_Link';

import { useLocation } from 'react-router-dom';

const LinkSocialMediaPage = ({ typeSocialMedia }) => {
  const location = useLocation();
  const current_url = location.pathname.substring(6, location.pathname.length);
  // Check if current_url is defined before using it
  if (current_url === 'telegram') {
    return (
      <div className=''>
        <TopBar
          title={typeSocialMedia}
          description="Keep conversations flowing and interactions dynamic"
        />
        <Telegram_Link  />
      </div>
    );
  } else {
    return (
      <div>
          
        <div className='w-full h-full '>
            <TopBar 
              title={typeSocialMedia}
              description="Keep conversations flowing and interactions dynamic"/>
            <Facebook_Link current_SocialMedia={current_url}/>
          </div>
      </div>
    );
  }
};

export default LinkSocialMediaPage;
