import QuestionDisplay from "@/components/questionDisplay"
import { createClient } from "@/utils/supabase/server"
import { PostgrestSingleResponse } from "@supabase/supabase-js"
import { Qahiri } from "next/font/google"
import { redirect } from "next/navigation"
import { describe } from "node:test"
type Contests = {
    id: string,
    startTime: Date,
    contestName: string
}
export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const id = (await params).id
    const supabase = await createClient();

    type resultType = {
        data: Contests[],
        error: Error

    }
    const result: PostgrestSingleResponse<resultType[]> = await supabase.from('Contest').select('*').eq('id', id)
    if (result.error) throw result.error
    if (!result.data || result.data.length != 1) {
        return <h1>contest {id} has not been conducted yet</h1>
    }



    const Questionresult = await supabase.from('Contest-Qn-Relation').select('Question-Id').eq('Contest-Id', id)
    if (Questionresult.error) throw Questionresult.error

    if (!Questionresult.data || Questionresult.data.length < 1) {
        console.log(Questionresult)
        return <h1> contest {id} doesnt have any question yet</h1>
    }

    const { data } = Questionresult

    const QuestionFetchResult = await Promise.all(data.map(async (quesDetails:any) => {

        const QuestionDetails = await supabase.from('Question').select('*').eq('id', quesDetails["Question-Id"])
        console.log(QuestionDetails.data)

        return QuestionDetails.data?.at(0)
    }))
    console.log(QuestionFetchResult)
    return (
        <>
            <h1>Contest ID :{id} Name : {result.data.at?.(0)?.contestName} </h1>
            <br />
            <h1 className="text-2xl font-bold mb-4">Questions</h1>
            <br />
            {
                QuestionFetchResult.map((question) => (<div key={question.id} ><QuestionDisplay contestid={id} id={question.id} name={question.Question_Name} description={question.Description} /><br /></div>))
            }
        </>
    )
}