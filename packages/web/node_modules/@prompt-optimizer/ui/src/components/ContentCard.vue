<template>
  <div class="flex flex-col h-full max-h-screen overflow-hidden content-card">
    <div class="theme-card flex flex-col h-full min-h-[440px] max-h-full overflow-hidden">
      <div class="p-3 sm:p-4 space-y-3 sm:space-y-4 flex flex-col flex-1 min-h-0">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-card {
  /* 确保在所有情况下都可见 */
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  position: relative !important;
  z-index: 1 !important;
}

/* Mobile responsive improvements */
@media (max-width: 768px) {
  .content-card {
    /* 确保在mobile上正确显示 */
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    min-height: auto !important;
    height: auto !important;
  }
  
  .content-card .theme-card {
    /* 调整mobile上的样式 */
    min-height: auto !important;
    border-radius: 0.5rem !important;
  }
  
  .content-card .p-3 {
    /* 调整mobile上的padding */
    padding: 1rem !important;
  }
}

/* Global mobile visibility fixes */
:global(.mobile-visible) {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

:global(.mobile-hidden) {
  display: none !important;
}

/* Ensure all content is visible on mobile */
@media (max-width: 768px) {
  :global(*) {
    /* 确保所有元素在mobile上都可见 */
    max-width: 100% !important;
    box-sizing: border-box !important;
  }
  
  :global(.flex-col) {
    /* 确保flex column在mobile上正确工作 */
    flex-direction: column !important;
  }
  
  :global(.w-full) {
    /* 确保full width在mobile上正确工作 */
    width: 100% !important;
  }
}
</style>