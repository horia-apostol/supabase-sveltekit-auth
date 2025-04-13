<script lang="ts">
    export let name: string;
    export let adding: boolean;
    export let entryMessage: string;
    export let onNameChange: (value: string) => void;
    export let onSubmit: () => void;
  
    function handleInput(event: Event) {
      const target = event.target as HTMLInputElement;
      onNameChange(target.value);
    }
  
    function handleSubmit(event: Event) {
      event.preventDefault();
      onSubmit();
    }
  </script>
  
  <div class="card p-6 border border-surface-200-800 bg-surface-50-950 h-[192px]">
    <h2 class="text-xl font-semibold mb-4">New Entry</h2>
    <form on:submit={handleSubmit} class="form-control space-y-2">
      <input
        class="input input-bordered w-full"
        placeholder="New entry name"
        maxlength="50"
        value={name}
        on:input={handleInput}
      />
  
      <div class="flex justify-between items-center mt-4">
        <button
          type="submit"
          class="btn btn-primary preset-filled-primary-500"
          disabled={!name.trim() || adding}
        >
          Add Entry
        </button>
  
        {#if entryMessage}
          <p class="text-sm text-green-600">{entryMessage}</p>
        {/if}
      </div>
    </form>
  </div>
  