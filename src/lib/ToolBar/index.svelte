<script>
  import { Accordion, AccordionItem, Toggle, Slider } from 'carbon-components-svelte';

  import { onMount } from 'svelte';

  import ToolBarButtons from '$lib/ToolBar/ToolBarButtons.svelte';
  import ToolBarAttributes from '$lib/ToolBar/ToolBarAttributes.svelte';

  import {
    isCmdPressed,
    snapRadius,
    toolbarX,
    toolbarY,
    selectedPolygonIndex
  } from '$lib/stores';

  let toolbarEl;

  onMount(() => {
    const { x, y } = toolbarEl.getBoundingClientRect();
    toolbarX.set(x);
    toolbarY.set(y);
  });

  $: style = `left:${$toolbarX}px;top:${$toolbarY}px`;
</script>

<div class="toolbar" {style} bind:this={toolbarEl}>
  <ToolBarButtons />
  <Accordion>
    <!-- <AccordionItem>
      <svelte:fragment slot="title">
        Snap to other points: {$isSnapEnabled ? 'ON' : 'OFF'}
      </svelte:fragment>
      <div class="snap">
        <Toggle class="snap__toggle" labelA="" labelB="" bind:toggled={$isSnapEnabled} />
        <Slider
          disabled={!$isSnapEnabled}
          hideTextInput
          labelText="Snap Radius"
          light
          max={100}
          min={1}
          bind:value={$snapRadius}
        />
      </div>
    </AccordionItem> -->
    {#if $selectedPolygonIndex !== -1}
      <AccordionItem title="Selected Shape Attributes" open>
        <ToolBarAttributes />
      </AccordionItem>
    {/if}
  </Accordion>
</div>
