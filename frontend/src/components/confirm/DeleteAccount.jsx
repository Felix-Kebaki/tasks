import React from "react";

import { useDeleteAccountMutation } from "../../redux/api/userApiSlice";
import { useLogoutMutation } from "../../redux/api/userApiSlice";
import {logoutS} from '../../redux/features/authSlice'

import { useDispatch } from "react-redux";

export function DeleteAccount({setDeleteAcc}) {
    const dispatch=useDispatch()
  const [deleteAccount] = useDeleteAccountMutation();
  const [logout]=useLogoutMutation()

  const HandleDeleteAccount = async () => {
    try {
      const res = await deleteAccount();
      if (res.error) {
        console.error(res.error.data.error || res.error.error);
      } else {
        console.log(res.data.message);
        dispatch(logoutS())
        logout()
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const Cancel=()=>{
    setDeleteAcc(false)
  }
  return (
    <section className="ConfirmMainSec">
      <div className="ConfirmMainDiv">
        <p className="ConfirmationMainTitle title">Confirmation</p>
        <p className="ConfirmationMainDesc text">
          Are you sure you want to delete your account together with all associated data?
        </p>
        <div>
          <button onClick={HandleDeleteAccount}>confirm</button>
          <button onClick={Cancel}>cancel</button>
        </div>
      </div>
    </section>
  );
}
