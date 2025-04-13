<script lang="ts">
  // https://supabase.com/docs/guides/auth/server-side/sveltekit

  import { onMount } from 'svelte';
  import { invalidate } from '$app/navigation';

  let { data, children } = $props();
  let { session, supabase } = $derived(data);

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth');
      }
    });

    return () => data.subscription.unsubscribe();
  });

  import '../app.css';
  import Header from '$lib/components/layout/Header.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
</script>

<main class="min-h-screen flex flex-col" style="background: rgb(3, 3, 3); background: linear-gradient(342deg, rgba(3, 3, 3, 1) 81%, rgba(211, 0, 34, 1) 100%);">
  <Header />
  {@render children()}
  <Footer />
</main>
