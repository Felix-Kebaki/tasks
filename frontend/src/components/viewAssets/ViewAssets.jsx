import React from 'react'
import './viewAssets.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faXmark} from '@fortawesome/free-solid-svg-icons'

export function ViewAssets({view,setView}) {
  return (
    <section className='ViewAssetsMainSec'>
      <div className='ViewAssetsMainDiv'>
      <FontAwesomeIcon icon={faXmark} className='CancelImgOnClick' onClick={()=>setView(null)}/>
        <img src={view} alt="" />
      </div>
    </section>
  )
}
