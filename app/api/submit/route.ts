import { createClient } from '@/utils/supabase/server'
import type { NextApiRequest, NextApiResponse } from 'next'
 
export async function POST(
  req :Request
) {
  
  const body =await req.formData()
  const Answer = body.get("Answer")
  const TCId = body.get("testCaseId")
  console.log("RECD DATA ",Answer,TCId)
  const client = await createClient();

 const testcasedata= await client.from('TestCase').select('*').eq('id',TCId)

 if (testcasedata.error) throw testcasedata.error

 if (testcasedata.data === undefined || testcasedata.data.length === 0){
  throw Error("cannot find the testcase")
 }
 if(testcasedata.data.at(0)["ExpectedOutput"] === Answer){
  return Response.json({"success":true})
 }else{



  return Response.json({"success":false})
}
}