# SvelteKit + Supabase Auth

<p align="left">
  <img src="https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white" alt="SvelteKit" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img alt="Deploy Status" src="https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">
</p>

Minimal yet fully functional example of how to integrate [Supabase](https://supabase.com) authentication with [SvelteKit](https://svelte.dev/docs/kit/introduction), following the official Supabase [quickstart guide](https://supabase.com/docs/guides/getting-started/quickstarts/sveltekit) and extending it with a role-based authorization system using custom tables, CRUD functionality with Row Level Security (RLS) and API routes secured by both Supabase sessions and JWT bearer tokens.

## Live Demo

You can try the app at the following URL:

**https://sveltekit-supabase-auth-demo.vercel.app**

### Testing the app

To test the demo app, you'll need to register with a valid email address. Supabase will send a confirmation email.  
You can use a real email address or a temporary one (such as [https://temp-mail.org](https://temp-mail.org)) for testing purposes.

> After confirmation, you will be redirected to the dashboard and assigned a `USER` role. From there, you can update your profile, add personal entries and promote yourself to `ADMIN` to enable deletion.


## Database Schema

The database includes custom tables for profiles, entries, roles, and role assignments.  
Row Level Security (RLS) policies are used to enforce access control at the database level.

**View schema diagram**: [here](./docs/supabase-schema.png)

## Supabase Setup

To run the project locally or deploy your own version, you'll need a [Supabase](https://supabase.com) project.

### Required tables

Run the following SQL script in the **SQL Editor** of your Supabase project:

```sql
create table if not exists public.roles (
    id uuid primary key default gen_random_uuid(),
    role text not null unique,
    created_at_utc timestamptz default now(),
    updated_at_utc timestamptz default now()
);

create table if not exists public.profiles (
    user_id uuid primary key references auth.users(id) on delete cascade,
    first_name text,
    last_name text,
    created_at_utc timestamptz default now(),
    updated_at_utc timestamptz default now()
);

create table if not exists public.entries (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    user_id uuid not null references public.profiles(user_id) on delete cascade,
    created_at_utc timestamptz default now(),
    updated_at_utc timestamptz default now()
);

create table if not exists public.user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(user_id) on delete cascade,
    role_id uuid not null references public.roles(id) on delete cascade,
    created_at_utc timestamptz default now(),
    updated_at_utc timestamptz default now()
);

alter table public.entries enable row level security;
alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.user_roles enable row level security;

create policy "Allow insert own entries" on public.entries
for insert to authenticated
with check (user_id = auth.uid());

create policy "Allow read own entries" on public.entries
for select to authenticated
using (user_id = auth.uid());

create policy "Enable delete for users based on user_id" on public.entries
for delete to public
using (user_id = auth.uid());

create policy "Allow authenticated insert own profile" on public.profiles
for insert to authenticated
with check (user_id = auth.uid());

create policy "Allow read own profile" on public.profiles
for select to authenticated
using (user_id = auth.uid());

create policy "User can update own profile" on public.profiles
for update to authenticated
using (user_id = auth.uid());

create policy "Allow authenticated read access to roles" on public.roles
for select to authenticated
using (true);

create policy "Allow select for own roles" on public.user_roles
for select to authenticated
using (user_id = auth.uid());

create policy "Allow insert own user_roles" on public.user_roles
for insert to authenticated
with check (user_id = auth.uid());

create policy "Allow delete own roles" on public.user_roles
for delete to authenticated
using (user_id = auth.uid());
```
Then, insert the following roles with a new script in the **SQL Editor**:

```sql
insert into public.roles (role) values ('USER') on conflict do nothing;
insert into public.roles (role) values ('ADMIN') on conflict do nothing;
```

## Cloning and Local Setup

**1. Clone the repository:**
```
git clone https://github.com/horia-apostol/sveltekit-supabase-auth.git
cd sveltekit-supabase-auth
```

**2. Install dependencies:**
```
npm install
```

**3. Create a** `.env.local` **file as described in the next section.**

**4. Run the development server:**
```
npm run dev
```

## Environment Variables

Before deploying or running the project locally, you need to configure environment variables.

For **local development**, create a `.env.local` file in the root of the project with the following:

```env
PUBLIC_SUPABASE_URL="your-supabase-url"
PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_JWT_SECRET="your-supabase-jwt-secret"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```
These values can be found in your Supabase project under **Project Settings** → **Data API**.

### Note:

- `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` are public and used by the frontend.
- `SUPABASE_JWT_SECRET` and `SUPABASE_SERVICE_ROLE_KEY` are sensitive; they are used only on the server side.

## Deployment on Vercel

You can deploy your own copy of this project using Vercel in a few simple steps.

1. **Click the button below to deploy the app:**

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/horia-apostol/sveltekit-supabase-auth&env=PUBLIC_SUPABASE_URL,PUBLIC_SUPABASE_ANON_KEY,SUPABASE_JWT_SECRET,SUPABASE_SERVICE_ROLE_KEY)

2. **Set the following environment variables in Vercel during deployment:**

   ```env
   PUBLIC_SUPABASE_URL=your-supabase-url
   PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_JWT_SECRET=your-supabase-jwt-secret
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
    ```
     which you can find as described above.

## Redirect Configuration

To ensure that email confirmation links work correctly in the live version, set the Site URL in your Supabase project:

1. In your Supabase dashboard, go to **Authentication** → **URL Configuration**.
2. Set the **Site URL** to `https://<your-project-name>.vercel.app/auth/login`

This ensures that after users confirm their email, they are redirected to your hosted app rather than to `http://localhost:3000`

## Bearer Token Testing

The project includes a Bearer token–protected endpoint. This is intended for external API integrations where cookies are not available.

### How to Test

**1. Obtain a JWT token:**
Use your favorite API client to make a POST request to:
```
<PUBLIC_SUPABASE_URL>/auth/v1/token?grant_type=password
```
with headers:
```
Content-Type: application/json
apikey: <PUBLIC_SUPABASE_ANON_KEY>
```
and a JSON body containing your email and password.
```
{
  "email": "email@example.com",
  "password": "password"
}
```

**2. Call the Bearer endpoint:**

Send a `GET` request to:

```
https://<your-project-name>.vercel.app/api/bearer
```
or to your local version of the app, including the header:
```
Authorization: Bearer <access_token>
```
