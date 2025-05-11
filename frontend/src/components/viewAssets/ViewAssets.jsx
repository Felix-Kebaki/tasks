import React from 'react'
import './viewAssets.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faXmark} from '@fortawesome/free-solid-svg-icons'

export function ViewAssets({view,setView}) {
  return (
    <section className='ViewAssetsMainSec'>
      <FontAwesomeIcon icon={faXmark} className='CancelImgOnClick' onClick={()=>setView(null)}/>
      <div className='ViewAssetsMainDiv'>
        <img src={view} alt="" />
      </div>
    </section>
  )
}
