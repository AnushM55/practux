'use client'
import Form from 'next/form'

type testCaseProps = {
    containsInput: boolean,
    testcaseNumber: number,
    GivenInput: string,
    testCaseId : number
}

export default function TestCodeAndSubmission(props: testCaseProps ) {
    const onSubmit = async (data: FormData) => {
        {

            var updatedData = data
            updatedData.append("testCaseId",props.testCaseId.toString())
            const response = await fetch('/api/submit', {
                method: 'POST',
                body: data
            })
            if (response.ok) {

                // Handle response if necessary
                const data = await response.json()

                console.log("ACTUWLY RECD DATA",data)
                if(data["success"] === true){
                    console.log("success")
                }

                
            }
        }

    }

    return (
        <>
            <h1>{props.testcaseNumber}</h1>
            {(props.containsInput === true) && <><h1> Input </h1> {props.GivenInput}  </>
            }

            <br />

            <Form action={onSubmit}>
                <input type="text" placeholder="Enter your text here" name="Answer" />
                <input type="submit" placeholder="Submit Your Answer" />
            </Form>
        </>
    );

}