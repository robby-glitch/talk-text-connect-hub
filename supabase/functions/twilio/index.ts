
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'
import { corsHeaders } from '../_shared/cors.ts'

// Get Supabase client
const supabaseUrl = 'https://mlttglkptuhwmscmlaau.supabase.co'
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseKey)

// Get Twilio credentials from environment variables
const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID') || ''
const authToken = Deno.env.get('TWILIO_AUTH_TOKEN') || ''
const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER') || ''

// Base URL for Twilio API
const twilioBaseUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}`

// Helper function to make authenticated requests to Twilio API
async function twilioRequest(endpoint: string, method = 'GET', data?: Record<string, string>) {
  const url = `${twilioBaseUrl}${endpoint}`
  const headers = new Headers({
    'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
    'Content-Type': method === 'POST' ? 'application/x-www-form-urlencoded' : 'application/json',
  })

  const options: RequestInit = { method, headers }
  
  if (method === 'POST' && data) {
    const formData = new URLSearchParams()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })
    options.body = formData
  }

  const response = await fetch(url, options)
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Twilio API error: ${response.status} ${error}`)
  }
  
  return response.json()
}

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get user token from request headers
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Verify the user token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid user token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const { pathname } = new URL(req.url)
    const path = pathname.replace('/twilio/', '')

    // Routing based on path and method
    if (path === 'calls' && req.method === 'GET') {
      // Get call history
      console.log('Fetching calls from Twilio API')
      const callsData = await twilioRequest('/Calls.json?PageSize=20')
      
      return new Response(
        JSON.stringify({ 
          calls: callsData.calls.map((call: any) => ({
            id: call.sid,
            direction: call.direction,
            status: call.status,
            from: call.from,
            to: call.to,
            duration: call.duration,
            date: call.date_created
          }))
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } 
    else if (path === 'calls' && req.method === 'POST') {
      // Make a new call
      const { to } = await req.json()
      if (!to) {
        return new Response(
          JSON.stringify({ error: 'To number is required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      console.log(`Making call to ${to} from ${twilioPhoneNumber}`)
      const callData = await twilioRequest('/Calls.json', 'POST', {
        To: to,
        From: twilioPhoneNumber,
        Url: 'http://demo.twilio.com/docs/voice.xml',
      })

      return new Response(
        JSON.stringify({ 
          id: callData.sid,
          status: callData.status 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } 
    else if (path === 'messages' && req.method === 'GET') {
      // Get message history
      console.log('Fetching messages from Twilio API')
      const messagesData = await twilioRequest('/Messages.json?PageSize=20')
      
      return new Response(
        JSON.stringify({ 
          messages: messagesData.messages.map((message: any) => ({
            id: message.sid,
            direction: message.direction === 'inbound' ? 'contact' : 'user',
            body: message.body,
            from: message.from,
            to: message.to,
            status: message.status,
            date: message.date_created
          }))
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } 
    else if (path === 'messages' && req.method === 'POST') {
      // Send a new message
      const { to, body } = await req.json()
      if (!to || !body) {
        return new Response(
          JSON.stringify({ error: 'To number and message body are required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      console.log(`Sending message to ${to} from ${twilioPhoneNumber}`)
      const messageData = await twilioRequest('/Messages.json', 'POST', {
        To: to,
        From: twilioPhoneNumber,
        Body: body
      })

      return new Response(
        JSON.stringify({ 
          id: messageData.sid,
          status: messageData.status 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    else {
      return new Response(
        JSON.stringify({ error: 'Not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
