<script>
  import {
    renderPolygons,
    hoveredPolygonIndex,
    hoveredLineIndex,
    selectedPolygonIndex,
    isDrawing,
    isExporting
  } from '$lib/stores';

  const handleLineMouseenter = ({ polygonIndex, lineIndex }) => {
    hoveredLineIndex.set(lineIndex);
    hoveredPolygonIndex.set(polygonIndex);
  };

  const handleLineMouseleave = () => {
    hoveredPolygonIndex.set(-1);
    hoveredLineIndex.set(-1);
  };

  const handleLineMouseup = ({ polygonIndex }) => {
    if ($isDrawing) return;

    selectedPolygonIndex.set(polygonIndex);
  };
</script>

{#if !$isExporting}
  {#each $renderPolygons as polygon, polygonIndex}
    {#each polygon.lines as line, lineIndex}
      <line
        x1={line.x1}
        x2={line.x2}
        y1={line.y1}
        y2={line.y2}
        stroke="transparent"
        stroke-width="10"
        class:is-hovered={lineIndex === $hoveredLineIndex && polygonIndex === $hoveredPolygonIndex}
        on:mouseenter={() => handleLineMouseenter({ polygonIndex, lineIndex })}
        on:mouseleave={handleLineMouseleave}
        on:mouseup={() => handleLineMouseup({ polygonIndex })}
      />
    {/each}
  {/each}
{/if}
