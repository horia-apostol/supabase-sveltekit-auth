<svelte:head>
  <title>Sveltekit Supabase Auth - Bearer</title>
</svelte:head>

<script lang="ts">
  export let data: { message: string };
</script>

<div class="container mx-auto my-10 flex-grow text-center">
    <h1 class="text-4xl font-bold text-primary">Bearer Authentication</h1>
    <p class="text-2xl text-gray-600">{data.message}</p>
</div>
