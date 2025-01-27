'use client';

import { redirect } from "next/navigation";


type QnDisplayProps = {
    id:string,
    contestid:string,
    name:string,
    description:string
}
const handleClick = (props:QnDisplayProps) => {
    console.log(props.contestid)
    redirect(`/protected/contests/${props.contestid}/Questions/${props.id}`)
}
export default function QuestionDisplay (props:QnDisplayProps){
    return (<div className="p-4 w-full">
        <div className="grid gap-4">
            <div
              key={props.id}
              className="p-4 border rounded-lg shadow-md bg-black flex justify-between items-center"
            >
              {/* Contest Name */}
              <h2 className="text-xl font-semibold text-white">{props.name}</h2>
  
              <div className="px-40" />
              {/* Attend Button */}
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={(e) => {handleClick(props)}}
              >
                explore
              </button>
            </div>
        </div>
      </div>)    

}