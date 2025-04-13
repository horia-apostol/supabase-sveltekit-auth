<script lang="ts">
    import { Pagination } from '@skeletonlabs/skeleton-svelte';
    import IconArrowLeft from '@lucide/svelte/icons/arrow-left';
    import IconArrowRight from '@lucide/svelte/icons/arrow-right';
    import IconEllipsis from '@lucide/svelte/icons/ellipsis';
    import IconFirst from '@lucide/svelte/icons/chevrons-left';
    import IconLast from '@lucide/svelte/icons/chevron-right';
  
    export let entries: { id: string; name: string; created_at_utc: string }[] = [];
    export let pageSize: number;
    export let pageIndex: number;
    export let isAdmin: boolean;
    export let onDelete: (id: string) => void;
    export let onPageChange: (event: { page: number }) => void;
  
    $: slicedEntries = entries.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
  </script>
  
  <div class="card bg-noise bg-surface-50-950 border border-surface-200-800 p-6 h-[402px] flex flex-col justify-between">
    <div class="table-wrap overflow-x-auto">
      <table class="table table-fixed caption-bottom w-full">
        <thead>
          <tr>
            <th>Position</th>
            <th>Name</th>
            <th class="!text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {#each slicedEntries as entry, i}
            <tr>
              <td>{(pageIndex - 1) * pageSize + i + 1}</td>
              <td class="truncate px-2 max-w-[12rem]">{entry.name}</td>
              <td class="text-right">
                <div class="relative group inline-block">
                  <button
                    class="btn btn-sm preset-filled-primary-500 disabled:pointer-events-none"
                    on:click={() => onDelete(entry.id)}
                    disabled={!isAdmin}
                  >
                    X
                  </button>
                  {#if !isAdmin}
                    <div class="absolute bottom-full right-0 mb-2 w-max max-w-[220px] bg-gray-800 text-white text-xs rounded px-3 py-1 hidden group-hover:block shadow-lg">
                      Only an admin can delete an entry
                    </div>
                  {/if}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  
    <footer class="mt-2 flex justify-center">
      <Pagination
        data={entries}
        pageSize={pageSize}
        page={pageIndex}
        onPageChange={onPageChange}
        siblingCount={2}
        alternative
      >
        {#snippet labelEllipsis()}<IconEllipsis class="size-4" />{/snippet}
        {#snippet labelNext()}<IconArrowRight class="size-4" />{/snippet}
        {#snippet labelPrevious()}<IconArrowLeft class="size-4" />{/snippet}
        {#snippet labelFirst()}<IconFirst class="size-4" />{/snippet}
        {#snippet labelLast()}<IconLast class="size-4" />{/snippet}
      </Pagination>
    </footer>
  </div>
  