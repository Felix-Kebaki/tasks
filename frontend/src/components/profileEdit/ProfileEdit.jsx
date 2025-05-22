import React, { useState } from 'react'
import './profileEdit.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faXmark} from '@fortawesome/free-solid-svg-icons'


export function ProfileEdit() {
  const [passwordForm,setPasswordForm]=useState({current:"",newPass:"",confirmNew:""})
  const {current,newPass,confirmNew}=passwordForm

  const OnChange=(e)=>{
    setPasswordForm((prev)=>({
      ...prev,[e.target.name]:e.target.value
    }))
  }
  return (
    <section className='ProfileEditMainSec'>
        <div className='ProfileEditMainDiv'>
            <div className='ProfileEditTopMainDiv'>
                <p className='title'>Your profile</p>
                <FontAwesomeIcon icon={faXmark} />
            </div>
            <form action="">
              <p>Password</p>
              <div>
                <div>
                  <label htmlFor="oldPasswordId">Current password</label><br/>
                  <input type="password" id='oldPasswordId' value={current} name='current' onChange={OnChange} />
                </div>
                <div>
                  <label htmlFor="NewPasswordId">New password</label><br/>
                  <input type="password" id='NewPasswordId' value={newPass} name='newPass' onChange={OnChange} />
                </div>
                <div>
                  <label htmlFor="confirmPasswordId">Confirm password</label><br/>
                  <input type="password" id='confirmPasswordId' value={confirmNew} name='confirmNew' onChange={OnChange} />
                </div>
              </div>
            </form>
        </div>
    </section>
  )
}
