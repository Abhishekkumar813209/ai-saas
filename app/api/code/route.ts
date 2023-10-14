import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import chatCompletionMessageParam from "openai"
import OpenAI from "openai";
import Configuration from "openai"
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY
})

const initialMessage : ChatCompletionMessageParam = {
    role:'system',
    content:"you are a code generator , you must anwer only in markdown code snippets. Use Code comments for explanations."
}

export async function POST(
    req:Request 
    ) {
        try{
            const {userId} = auth();
            const body = await req.json();
            const {messages} = body;
            
            if(!userId){
                return new NextResponse("Unauthorized",{status:401});
            }
            if(!openai.apiKey){
                return new NextResponse("OpenAI API Key not required",{status:500});
            }
            if(!messages){
                return new NextResponse("Messages are Required",{status:400});
            }

            const response = await openai.chat.completions.create({
                model:'gpt-3.5-turbo',
                messages:[initialMessage,...messages]
            })
            return NextResponse.json(response.choices[0].message);

        }catch(error){
            console.log('CODE_ERROR',error);
            return new NextResponse("Internal error",{status:500});
        }
    }