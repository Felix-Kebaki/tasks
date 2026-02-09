import { useDeleteAssignedTaskMutation } from "../../redux/api/assignTaskApiSlice"
import { useToast } from "../../context/ToastContext"
import { useNavigate } from "react-router-dom"

export function TeamTaskConfirm({getId,setGetId}) {

    const {showToast}=useToast()
    const navigate=useNavigate();

    const [deleteAssignedTask,{isLoading}]=useDeleteAssignedTaskMutation()

    const HandleDelete=async()=>{
        try {
            const res=await deleteAssignedTask({taskId:getId})
            if(res.error){
                console.error(res.error.data.error||res.error.error)
                showToast(res.error.data.error||res.error.error, "error")
            }else{
                showToast(res.data.message,"success")
                setGetId(null)
                navigate("/app/teams/eachTeam")
            }
        } catch (error) {
            showToast(error.message || error ,"error")
            console.error(error.message || error)
        }
    }

    const Cancel=()=>{
        setGetId(null)
    }
  return (
    <section className="ConfirmMainSec">
      <div className="ConfirmMainDiv">
        <p className="ConfirmationMainTitle title">Confirmation</p>
        <p className="ConfirmationMainDesc text">Are you sure you want to delete this assigned subtask?</p>
        <div>
          <button
            onClick={HandleDelete}
          >
            confirm
          </button>
          <button onClick={Cancel}>cancel</button>
        </div>
      </div>
    </section>
  )
}
