<svelte:head>
  <title>Sveltekit Supabase Auth - Dashboard</title>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';
  import { ROLES } from '$lib/shared/const/roles';
  import type { Entry } from '$lib/shared/types/entries';

  import WelcomeCard from '$lib/components/cards/WelcomeCard.svelte';
  import EditProfileCard from '$lib/components/cards/EditProfileCard.svelte';
  import RolesCard from '$lib/components/cards/RolesCard.svelte';
  import NewEntryCard from '$lib/components/cards/NewEntryCard.svelte';
  import EntriesTableCard from '$lib/components/cards/EntriesTableCard.svelte';

  export let data: {
    user: any;
    profile: { first_name: string; last_name: string };
    roles: string[];
    supabase: any;
  };

  let { supabase, profile } = data;
  let { first_name, last_name } = profile;
  let initialFirstName = first_name;
  let initialLastName = last_name;
  let message = '';
  let error = '';

  let name = '';
  let entries: Entry[] = [];
  let pageIndex = 1;
  let pageSize = 5;
  let loading = false;
  let adding = false;
  let entryMessage = '';

  let isAdmin = data.roles.includes(ROLES.ADMIN);

  $: isProfileValid =
    first_name.trim().length >= 2 &&
    first_name.trim().length <= 25 &&
    last_name.trim().length >= 2 &&
    last_name.trim().length <= 25 &&
    (
      first_name.trim() !== initialFirstName.trim() ||
      last_name.trim() !== initialLastName.trim()
    );

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) location.href = '/auth/login';
  };

  const loadEntries = async () => {
    loading = true;
    const res = await fetch('/api/entries');
    const json = await res.json();
    entries = json.entries ?? [];
    loading = false;
  };

  const addEntry = async () => {
    if (!name.trim() || adding) return;

    adding = true;
    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });

    const result = await res.json();

    if (res.ok) {
      name = '';
      entryMessage = result.message;
      await loadEntries();
      setTimeout(() => (entryMessage = ''), 2000);
    } else {
      error = result.error;
      message = '';
    }

    adding = false;
  };


  const deleteEntry = async (id: string) => {
    const res = await fetch(`/api/entries?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      await loadEntries();
      const totalPages = Math.ceil(entries.length / pageSize);
      if (pageIndex > totalPages) pageIndex = totalPages || 1;
    }
  };

  const updateProfile = async () => {
    const res = await fetch('/api/profiles', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name, last_name })
    });

    const result = await res.json();
    if (res.ok) {
      message = result.message;
      initialFirstName = first_name;
      initialLastName = last_name;
      error = '';
      setTimeout(() => (message = ''), 2000);
    } else {
      error = result.error;
      message = '';
    }
  };

  const toggleAdmin = async () => {
    const res = await fetch('/api/roles', { method: 'POST' });
    await res.json();

    const rolesRes = await fetch('/api/roles');
    const rolesJson = await rolesRes.json();
    data.roles = rolesJson.roles;
    isAdmin = data.roles.includes(ROLES.ADMIN);
  };

  const handlePageChange = (e: { page: number }) => pageIndex = e.page;

  onMount(() => {
    loadEntries();
  });
</script>

<div class="container mx-auto p-8 flex-grow mt-6">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div class="space-y-6">
      <WelcomeCard
        {first_name}
        {last_name}
        email={data.user.email}
        onLogout={logout}
      />
      <EditProfileCard
        {first_name}
        {last_name}
        isValid={isProfileValid}
        message={message}
        onFirstNameChange={(val) => first_name = val}
        onLastNameChange={(val) => last_name = val}
        onSubmit={updateProfile}
      />
      <RolesCard
        roles={data.roles}
        isAdmin={isAdmin}
        onToggleAdmin={toggleAdmin}
      />
    </div>

    <div class="space-y-6">
      <NewEntryCard
        {name}
        {adding}
        {entryMessage}
        onNameChange={(val) => name = val}
        onSubmit={addEntry}
      />
      <EntriesTableCard
        {entries}
        {pageIndex}
        {pageSize}
        {isAdmin}
        onDelete={deleteEntry}
        onPageChange={handlePageChange}
      />
    </div>
  </div>
</div>
