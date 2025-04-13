<svelte:head>
  <title>Sveltekit Supabase Auth - Register</title>
</svelte:head>

<script lang="ts">
  import type { ActionData } from './$types';
  export let form: ActionData;

  let password = '';
  let confirmPassword = '';
  let mismatch = false;

  function handleSubmit(event: Event) {
    mismatch = password !== confirmPassword;
    if (mismatch) event.preventDefault();
  }
</script>

<main class="flex-grow flex items-center justify-center">
  <div class="card preset-outlined-surface-200-800 bg-surface-50-950 p-10 space-y-5 w-full max-w-md">
    <header>
      <h3 class="h3">Create Account</h3>
      <p class="opacity-60">Complete the form to get started.</p>
    </header>
    <hr class="hr" />

    {#if form?.message && form.message !== ''}
      <p class="text-green-500">{form.message}</p>
    {/if}

    <form method="POST" class="grid grid-cols-1 gap-5" on:submit={handleSubmit}>
      <label class="label">
        <span class="label-text">First Name</span>
        <input name="first_name" class="input" required minlength="2" maxlength="25" />
      </label>

      <label class="label">
        <span class="label-text">Last Name</span>
        <input name="last_name" class="input" required minlength="2" maxlength="25" />
      </label>

      <label class="label">
        <span class="label-text">Email</span>
        <input name="email" type="email" class="input" required />
      </label>

      <label class="label">
        <span class="label-text">Password</span>
        <input
          name="password"
          type="password"
          class="input"
          bind:value={password}
          required
        />
      </label>

      <label class="label">
        <span class="label-text">Confirm Password</span>
        <input
          type="password"
          class="input"
          bind:value={confirmPassword}
          required
        />
      </label>

      {#if mismatch}
        <p class="text-red-500 text-sm">Passwords do not match</p>
      {/if}

      <button type="submit" class="w-full btn preset-filled-primary-500">
        Create Account
      </button>
    </form>

    <p class="text-center text-sm opacity-80">
      Already have an account?
      <a href="/auth/login" class="text-primary-500 hover:underline">Login</a>
    </p>
  </div>
</main>
