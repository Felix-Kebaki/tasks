import React from 'react'
import './profileEdit.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faXmark} from '@fortawesome/free-solid-svg-icons'


export function ProfileEdit() {
  return (
    <section className='ProfileEditMainSec'>
        <div className='ProfileEditMainDiv'>
            <div className='ProfileEditTopMainDiv'>
                <p className='title'>Your profile</p>
                <FontAwesomeIcon icon={faXmark} />
            </div>
        </div>
    </section>
  )
}
