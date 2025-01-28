
import QuestionDisplay from "@/components/questionDisplay"
import TestCodeAndSubmission from "@/components/TestCodeAndSubmission"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { remark } from "remark"
import html from "remark-html"


type insertContent = {
    Contest_Id: string,
    Question_Id: string,
    User_Id: string,
    PointsScored: string,
    TimeStamp: Date
}


export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ id: string, slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const id = (await params).id
    const slug = (await params).slug
    const supabase = await createClient();

    const { data, error } = await supabase.from('Contest').select('*').eq('id', id)
    if (error) throw error
    if (!data || data.length != 1) {
        return <h1>contest {id} has not been conducted yet</h1>
    }



    const Questionresult = await supabase.from('Contest-Qn-Relation').select('*').eq('Question-Id', slug).eq('Contest-Id', id)
    if (Questionresult.error) throw Questionresult.error

    if (!Questionresult.data || Questionresult.data.length < 1) {
        console.log(Questionresult)
        return <h1> contest {id} doesnt have that question</h1>
    }


    const pts = Questionresult.data.at(0)?.["points"]

    const QuestionDetails = await supabase.from('Question').select('*').eq('id', slug)

    const processedContent = await remark().use(html).process(QuestionDetails.data?.at(0)["Description"])

    const inputForTestCase = await supabase.from('TestcaseQnRelation').select('id').eq("question_id", slug)
    if (inputForTestCase.error) throw inputForTestCase.error
    if (inputForTestCase.data.length === 0) throw Error("test case fetching failed ")
    const inputdata = inputForTestCase.data?.at(0)
    if (inputdata === undefined) {
        throw Error("error while fetching content")

    }
    const testcaseContent = await supabase.from('TestCase').select('*').eq('id', inputdata["id"])
    if (testcaseContent.error) {
        console.log("errors found ")
        throw testcaseContent.error
    }

    if (testcaseContent.data === undefined || testcaseContent.data.length === 0) {
        throw Error("No data fetched")
    }
    const inputData = testcaseContent.data?.at(0)
    if (inputData === undefined || inputData["Input"] === undefined) {

        throw Error("No data fetched")
    } else {
        console.log("NO ERROR I THINK", inputData)
    }


    const onSubmitCallback = async () => {
        const user = await supabase.auth.getUser()
        const userid = user.data.user?.id
        if (userid != null) {
            const content: insertContent = {
                Contest_Id: id,
                Question_Id: slug,
                TimeStamp: new Date(Date.now()),
                PointsScored: pts,
                User_Id: userid
            }
            await supabase.from('Submissions').insert(content)
            redirect(`/protected/contests/${id}`)
        }
    }
    return (
        <>
            <h1>Contest ID :{id} Qn Name : {slug}  Points : {pts}</h1>
            <br />
            <h1 className="text-2xl font-bold mb-4">Description</h1>
            <div className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: processedContent.toString() }} />
            <TestCodeAndSubmission  GivenInput={inputData["Input"]} containsInput={(inputData["Input"] !== '-')?true:false} testcaseNumber={1} testCaseId={inputData["id"]} />
            <br />
        </>
    )
}