<script>
  import {
    isDrawing,
    isCmdPressed,
    isAltPressed,
    renderPolygons,
    selectedPolygonIndex,
    hoveredPolygonIndex,
    hoveredPoint,
    draggedPoint,
    selectedPoint,
    closestSnapPoint,
    closestLinePoint,
    imageWidth,
    imageHeight,
    hoveredLineIndex
  } from '$lib/stores';

  const handlePointMouseenter = ({ point, polygonIndex }) => {
    hoveredPolygonIndex.set(polygonIndex);
    hoveredPoint.set(point);
  };

  const handlePointMouseleave = (e) => {
    const hasPointTarget = e.path.some((el) => el.matches?.('.point'));
    const hasPolygonTarget = e.path.some((el) => el.matches?.('polygon'));

    hoveredPoint.set(null);

    if (!hasPolygonTarget) hoveredPolygonIndex.set(-1);
    if (!hasPointTarget) draggedPoint.set(null);
  };

  const handlePointMousedown = ({ point, polygonIndex }) => {
    if ($isDrawing) return;

    selectedPolygonIndex.set(polygonIndex);
    draggedPoint.set({ ...point });
  };

  const handlePointMouseup = ({ point }) => {
    selectedPoint.set({ ...point });
  };
</script>

{#each $renderPolygons as polygon, polygonIndex}
  {#each polygon.points as point, pointIndex}
    <div
      style={`left:${point.x}px;top:${point.y}px;`}
      class="point"
      class:is-polygon-selected={polygonIndex === $selectedPolygonIndex}
      class:is-polygon-hovered={polygonIndex === $hoveredPolygonIndex}
      class:is-hovered={polygonIndex === $hoveredPolygonIndex && point.id === $hoveredPoint?.id}
      class:is-closest-snappable={point.id === $closestSnapPoint?.id && $isCmdPressed}
      class:is-dragged={point.id === $draggedPoint?.id}
      class:is-selected={point.id === $selectedPoint?.id}
      id={point.id}
      tabindex="0"
      on:mouseenter={() => handlePointMouseenter({ point, polygonIndex })}
      on:mousedown={() => handlePointMousedown({ point, polygonIndex })}
      on:mouseup={() => handlePointMouseup({ point })}
      on:mouseleave={handlePointMouseleave}
    />
  {/each}
{/each}
{#if $isCmdPressed}
  {#if $closestSnapPoint?.id === 'snap-left'}
    <div style={`left:0px;top:${$closestSnapPoint?.y}px;`} class="point is-polygon-selected" />
  {:else if $closestSnapPoint?.id === 'snap-top'}
    <div style={`left:${$closestSnapPoint?.x}px;top:0px;`} class="point is-polygon-selected" />
  {:else if $closestSnapPoint?.id === 'snap-right'}
    <div
      style={`left:${imageWidth}px;top:${$closestSnapPoint?.y}px;`}
      class="point is-polygon-selected"
    />
  {:else if $closestSnapPoint?.id === 'snap-bottom'}
    <div
      style={`left:${$closestSnapPoint?.x}px;top:${imageHeight}px;`}
      class="point is-polygon-selected"
    />
  {/if}
{/if}
{#if $closestLinePoint && $isAltPressed && $hoveredLineIndex}
  <div
    style={`left:${$closestLinePoint?.x}px;top:${$closestLinePoint?.y}px;pointer-events:none`}
    class="point is-midline"
  />
{/if}
