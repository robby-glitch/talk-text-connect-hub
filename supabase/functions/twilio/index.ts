
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'
import { corsHeaders } from '../_shared/cors.ts'
import { twilio } from 'https://esm.sh/twilio@4.25.0'

// Get Supabase client
const supabaseUrl = 'https://mlttglkptuhwmscmlaau.supabase.co'
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseKey)

// Get Twilio credentials from environment variables
const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID') || ''
const authToken = Deno.env.get('TWILIO_AUTH_TOKEN') || ''
const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER') || ''

// Initialize Twilio client
const twilioClient = twilio(accountSid, authToken)

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
      const calls = await twilioClient.calls.list({ limit: 20 })
      return new Response(
        JSON.stringify({ calls: calls.map(call => ({
          id: call.sid,
          direction: call.direction,
          status: call.status,
          from: call.from,
          to: call.to,
          duration: call.duration,
          date: call.dateCreated
        }))}),
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

      const call = await twilioClient.calls.create({
        to,
        from: twilioPhoneNumber,
        url: 'http://demo.twilio.com/docs/voice.xml', // TwiML instructions for the call
      })

      return new Response(
        JSON.stringify({ 
          id: call.sid,
          status: call.status 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } 
    else if (path === 'messages' && req.method === 'GET') {
      // Get message history
      const messages = await twilioClient.messages.list({ limit: 20 })
      return new Response(
        JSON.stringify({ messages: messages.map(message => ({
          id: message.sid,
          direction: message.direction === 'inbound' ? 'contact' : 'user',
          body: message.body,
          from: message.from,
          to: message.to,
          status: message.status,
          date: message.dateCreated
        }))}),
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

      const message = await twilioClient.messages.create({
        to,
        from: twilioPhoneNumber,
        body
      })

      return new Response(
        JSON.stringify({ 
          id: message.sid,
          status: message.status 
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
