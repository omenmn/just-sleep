<script lang="ts">
  let bedtime = localStorage.getItem('bedtime') || '23:00'

  const save = (): null => {
    localStorage.setItem('bedtime', bedtime)
    window.api.setBedtime(bedtime) // notify main process
    saved = true
    setTimeout(() => (saved = false), 1500)
  }

  let saved = false
</script>

<div class="w-full h-full flex items-center justify-center bg-bg text-fg">
  <div
    class="flex flex-col gap-6 p-8 bg-bg/40 border border-fg/20 rounded-xl shadow-lg w-80 text-center"
  >
    <h1 class="text-2xl font-semibold">Set Your Bedtime</h1>

    <input
      type="time"
      bind:value={bedtime}
      class="w-full px-3 py-2 bg-bg border border-fg/20 rounded focus:border-fg/40 outline-none"
    />

    <button
      class="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 transition text-white font-medium"
      on:click={save}
    >
      Save
    </button>

    {#if saved}
      <span class="text-sm text-green-400 fade-in">Saved ✓</span>
    {/if}
  </div>
</div>

<style>
  .fade-in {
    animation: fade 0.5s ease;
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
