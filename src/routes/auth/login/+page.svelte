<svelte:head>
  <title>Sveltekit Supabase Auth - Login</title>
</svelte:head>

<script lang="ts">
  export let data: { confirmed: boolean };
</script>

<main class="flex-grow flex items-center justify-center">
  <div class="card preset-outlined-surface-200-800 bg-surface-50-950 p-10 space-y-5 w-full max-w-md">
    <header>
      <h3 class="h3">Login</h3>
      <p class="opacity-60">Access your account securely.</p>
    </header>
    <hr class="hr" />

    {#if data.confirmed}
      <p class="text-green-500">Email confirmed successfully. You can now log in.</p>
    {/if}

    <form method="POST" action="/auth/login" class="grid grid-cols-1 gap-5">
      <label class="label">
        <span class="label-text">Email</span>
        <input name="email" type="email" class="input" required autocomplete="email" />
      </label>

      <label class="label">
        <span class="label-text">Password</span>
        <input name="password" type="password" class="input" required autocomplete="current-password" />
      </label>

      <button type="submit" class="w-full btn preset-filled-primary-500">Login</button>
    </form>

    <p class="text-center text-sm opacity-80">
      Don't have an account?
      <a href="/auth/register" class="text-primary-500 hover:underline">Register</a>
    </p>
  </div>
</main>
