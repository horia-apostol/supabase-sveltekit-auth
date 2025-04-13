<script lang="ts">
    export let first_name: string;
    export let last_name: string;
    export let email: string;
    export let onLogout: () => void;
  </script>
  
  <div class="card p-6 border border-surface-200-800 bg-surface-50-950 flex justify-between items-center h-[114px]">
    <div>
      <h2 class="text-xl font-semibold mb-1">Welcome, {first_name} {last_name}</h2>
      <p class="text-gray-500">{email}</p>
    </div>
    <button class="btn btn-sm preset-filled-primary-500 ml-4" on:click={onLogout}>
      Logout
    </button>
  </div>
  