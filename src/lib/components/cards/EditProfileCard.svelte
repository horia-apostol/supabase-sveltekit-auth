<script lang="ts">
    export let first_name: string;
    export let last_name: string;
    export let onFirstNameChange: (value: string) => void;
    export let onLastNameChange: (value: string) => void;
    export let onSubmit: () => void;
    export let isValid: boolean;
    export let message: string;
  </script>
  
  <div class="card p-6 border border-surface-200-800 bg-surface-50-950 h-[228px]">
    <h2 class="text-xl font-semibold mb-4">Edit Profile</h2>
    <form on:submit|preventDefault={onSubmit} class="form-control space-y-2">
      <input
        class="input input-bordered"
        value={first_name}
        placeholder="First Name"
        maxlength="25"
        on:input={(e) => onFirstNameChange((e.target as HTMLInputElement).value)}
      />
      <input
        class="input input-bordered"
        value={last_name}
        placeholder="Last Name"
        maxlength="25"
        on:input={(e) => onLastNameChange((e.target as HTMLInputElement).value)}
      />
      <div class="flex flex-grow justify-between items-center mt-4">
        <button type="submit" class="btn preset-filled-primary-500" disabled={!isValid}>
          Update Profile
        </button>
        {#if message}
          <p class="text-sm text-green-600">{message}</p>
        {/if}
      </div>
    </form>
  </div>
  