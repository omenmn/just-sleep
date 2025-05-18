<script lang="ts">
  import CloseSVG from './assets/close.svelte'
  import MinimizeSVG from './assets/minimize.svelte'

  const close = (): void => window.electron.ipcRenderer.send('hide')
</script>

<div class="bg-gray-900 h-screen w-screen overflow-hidden text-[#f2f2f2] flex-col gap-4 p-5">
  <div class="flex w-full justify-between items-center mb-10">
    <span class="text-xl">Just Sleep Man</span>
    <div class="flex gap-4 items-center justify-center">
      <button class="" on:click={close}>
        <MinimizeSVG />
      </button>
      <button class="" on:click={close}>
        <CloseSVG />
      </button>
    </div>
  </div>
  <div class="">hi</div>
</div>
