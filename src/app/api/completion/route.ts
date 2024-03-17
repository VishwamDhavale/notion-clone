import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';
 
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
 
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';
 
export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
const { prompt } = await req.json();

const custtomPrompt =`I am writing a piece of text in a notion text editor app.
Help me complete my train of thought here: ${prompt}
keep the tone of the text consistent with the rest of the text.
keep the response short and sweet also it should long text(length) minimum of 2 lines of text.`

// Ask Google Generative AI for a streaming completion given the prompt
const response = await genAI
    .getGenerativeModel({ model: 'gemini-pro' })
    .generateContentStream({
        contents: [
            { role: 'user', parts: [{ text: custtomPrompt }] },
            
        ],
    });

// Convert the response into a friendly text-stream
const stream = GoogleGenerativeAIStream(response);
//   console.log(JSON.stringify(stream))
 
  // Respond with the stream
  return new StreamingTextResponse(stream);
}