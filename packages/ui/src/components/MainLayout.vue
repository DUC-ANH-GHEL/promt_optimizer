<template>
  <div class="h-screen flex flex-col min-h-0 transition-colors duration-300">
    <!-- 顶部导航栏 -->
    <header class="theme-header flex-none">
      <div class="w-full mx-auto px-2 sm:px-4 py-2 sm:py-3 flex justify-between items-center">
        <h1 class="text-lg sm:text-xl font-bold theme-title flex items-center gap-2">
          <img src="../assets/logo.jpg" alt="Logo" class="h-8 w-8 rounded-lg" />
          <slot name="title">{{ t('common.appName') }}</slot>
        </h1>
        <div class="flex items-center gap-1 sm:gap-3">
          <slot name="actions"></slot>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="flex-1 min-h-0 w-full mx-auto p-2 sm:p-4">
      <div class="flex flex-col lg:flex-row gap-2 sm:gap-4 h-full mobile-layout">
        <slot></slot>
      </div>
    </main>

    <!-- 弹窗插槽 -->
    <slot name="modals"></slot>

    <!-- 全局提示 -->
    <ToastUI />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ToastUI } from '../index'

const { t } = useI18n()
</script>

<style>
.custom-select {
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
  background-image: none !important;
}

.custom-select::-ms-expand {
  display: none;
}

/* Mobile layout improvements */
.mobile-layout {
  /* 确保在mobile上正确显示 */
  display: flex !important;
  flex-direction: column !important;
}

/* 确保在mobile上所有内容都可见 */
@media (max-width: 1024px) {
  .mobile-layout {
    flex-direction: column !important;
    gap: 1rem !important;
  }
  
  .mobile-layout > * {
    /* 确保每个子元素都可见 */
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    height: auto !important;
    min-height: auto !important;
    width: 100% !important;
    max-width: 100% !important;
  }
}

/* 特别针对mobile优化 */
@media (max-width: 768px) {
  .mobile-layout {
    gap: 0.75rem !important;
  }
  
  .mobile-layout > * {
    /* 确保在mobile上正确显示 */
    position: relative !important;
    z-index: 1 !important;
    overflow: visible !important;
  }
}
</style>