<script lang="ts">
    export let roles: string[] = [];
    export let isAdmin: boolean;
    export let onToggleAdmin: () => void;
  </script>
  
  <div class="card p-6 border border-surface-200-800 bg-surface-50-950 h-[228px] flex flex-col justify-between">
    <div class="flex flex-col flex-grow justify-between">
      <h2 class="text-xl font-semibold mb-4">Roles</h2>
  
      <table class="table table-fixed caption-bottom w-full [&>tbody>tr>td]:ps-0">
        <tbody>
          {#each roles as role}
            <tr><td>{role}</td></tr>
          {/each}
        </tbody>
      </table>
  
      <button class="btn mt-4 preset-filled-primary-500 self-start" on:click={onToggleAdmin}>
        {isAdmin ? 'Remove Admin Role' : 'Make Me Admin'}
      </button>
    </div>
  </div>
  