
import QuestionDisplay from "@/components/questionDisplay"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { remark } from "remark"
import html from "remark-html"
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


    return (
        <>
            <h1>Contest ID :{id} Qn Name : {slug}  Points : {pts}</h1>
            <br />
            <h1 className="text-2xl font-bold mb-4">Description</h1>
            <div className="whitespace-pre-line" dangerouslySetInnerHTML={{__html:processedContent.toString()}}/>
            <br />
        </>
    )
}