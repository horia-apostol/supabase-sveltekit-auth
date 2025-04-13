import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ locals }) => {
  if (locals.session) {
    await locals.supabase.auth.signOut()
  }

  throw redirect(303, '/auth/login?confirmed=true')
}
