type Env = {
  N8N_WEBHOOK_URL?: string
  N8N_BASIC_AUTH_USER?: string
  N8N_BASIC_AUTH_PASSWORD?: string
}

type RsvpPayload = {
  name?: unknown
  mobile?: unknown
  guests?: unknown
  greeting?: unknown
  attending?: unknown
}

const json = (body: Record<string, unknown>, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...init?.headers,
    },
  })

const getString = (value: unknown) => (typeof value === "string" ? value.trim() : "")

const isPhilippineMobileNumber = (value: string) => /^(?:\+63|63|0)9\d{9}$/.test(value.replace(/[\s-]/g, ""))

export const onRequest = async ({ request, env }: { request: Request; env: Env }) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, { status: 405, headers: { allow: "POST" } })
  }

  const webhookUrl = env.N8N_WEBHOOK_URL
  const authUser = env.N8N_BASIC_AUTH_USER
  const authPassword = env.N8N_BASIC_AUTH_PASSWORD

  if (!webhookUrl || !authUser || !authPassword) {
    return json({ error: "RSVP service is not configured." }, { status: 500 })
  }

  let payload: RsvpPayload

  try {
    payload = (await request.json()) as RsvpPayload
  } catch {
    return json({ error: "Invalid request body." }, { status: 400 })
  }

  const name = getString(payload.name)
  const mobile = getString(payload.mobile)
  const guests = getString(payload.guests)
  const greeting = getString(payload.greeting)
  const attending = getString(payload.attending)

  if (!name || !mobile || !guests || !attending) {
    return json({ error: "Please complete all required fields." }, { status: 400 })
  }

  if (!isPhilippineMobileNumber(mobile)) {
    return json({ error: "Enter a valid Philippine mobile number." }, { status: 400 })
  }

  if (!/^[1-4]$/.test(guests)) {
    return json({ error: "Select a valid number of guests." }, { status: 400 })
  }

  if (!["yes", "no"].includes(attending)) {
    return json({ error: "Select whether you will attend." }, { status: 400 })
  }

  const forwardedPayload = {
    name,
    phone: mobile,
    guests,
    message: greeting,
    attending,
  }

  const authHeader = btoa(`${authUser}:${authPassword}`)
  let webhookResponse: Response

  try {
    webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        authorization: `Basic ${authHeader}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(forwardedPayload),
    })
  } catch {
    return json({ error: "RSVP could not be submitted. Please try again." }, { status: 502 })
  }

  if (!webhookResponse.ok) {
    return json({ error: "RSVP could not be submitted. Please try again." }, { status: 502 })
  }

  return json({ ok: true, attending })
}
