import React from 'react';
import {FaLayerGroup} from "react-icons/fa"
import {CiGrid41} from "react-icons/ci"
import {RxPerson} from "react-icons/rx"
import {AiOutlineShoppingCart} from "react-icons/ai"
import {TfiTruck} from "react-icons/tfi"
import {GrCompliance} from "react-icons/gr"
import {FcSettings} from "react-icons/fc"
import {HiOutlineLogout} from "react-icons/hi"


export const linksSideBar = [
    {
      title: 'Main',
      links: [
        {
          name: 'Dashboard',
          icon: <FaLayerGroup />,
          link:'dashboard'
        },
        {
          name: 'Owner',
          icon: <CiGrid41/>,
          link:'owner'
        },
        {
          name: 'Plans',
          icon: <CiGrid41/>,
          link:'plans'
        },
        {
          name: 'Settings',
          icon: <CiGrid41/>,
          link:'settings'
        },
       
       
       
        
       
      ],
    },
  
  ]