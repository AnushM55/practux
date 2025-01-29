'use client'
import { createClient } from '@/utils/supabase/client'
import { redirect } from 'next/navigation'
import Form from 'next/form'
import { useState } from 'react'
import { Button } from './ui/button'

type testCaseProps = {
    containsInput: boolean,
    testcaseNumber: number,
    GivenInput: string,
    testCaseId: number,
    Question_Id: string,
    ContestId: string,
    Points: number,
    UserId: string
}

type insertContent = {
    Contest_Id: string,
    Question_Id: string,
    User_Id: string,
    Points_Scored: number,
    timeStamp: Date
}

export default function TestCodeAndSubmission(props: testCaseProps) {
    const [result,setResult] = useState("submit your answer")
    const onSubmit = async (data: FormData) => {
        {
            setResult("Answer submitted, waiting for result")

            var updatedData = data
            updatedData.append("testCaseId", props.testCaseId.toString())
            const response = await fetch('/api/submit', {
                method: 'POST',
                body: data
            })
            if (response.ok) {

                // Handle response if necessary
                const data = await response.json()

                console.log("ACTUWLY RECD DATA", data)
                if (data["success"] === true) {
                    console.log("success")
                    const client = createClient()
                    const content: insertContent = {
                        Contest_Id: props.ContestId,
                        Question_Id: props.Question_Id,
                        timeStamp: new Date(Date.now()),
                        Points_Scored: props.Points,
                        User_Id: props.UserId
                    }
                    const res = client.from("Submissions")
                    console.log("result of that is ", res)
                    const res2 = await res.insert(content)
                    console.log("and then res",res2)
                    if (!res2.error){
                        setResult("Answer accepted.. you will be redirected shortly")
                        redirect(`/protected/contests/${props.ContestId}/`)
                    }else{
                        setResult(`Some error occured : ${res2.error}`)
                    }
                }else{
                    setResult("Answer not accepted")
                }

            }


        }
    }

    return (
        <div>
            <h1>{props.testcaseNumber}</h1>
            {(props.containsInput === true) && <><h1> Input </h1> {props.GivenInput}  </>
            }

            <br />

            <Form action={onSubmit}>
                <input type="text" placeholder="Enter your text here" name="Answer" />
                <Button type="submit">Submit Answer</Button>
            </Form>
            <br></br>
            <div>{result}</div>
            <br></br>

                <Button onClick={()=> {
                    redirect(`/protected/contests/${props.ContestId}`)
                }}>Back to Contest?</Button>
        </div>
    );

}