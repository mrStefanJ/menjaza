<template>
  <section class="auth">
    <div class="auth__card">
      <h2 class="auth__title">
        <slot name="title" />
      </h2>

      <div class="auth__content">
        <slot />
      </div>

      <p v-if="$slots.footer" class="auth__footer">
        <slot name="footer" />
      </p>

      <p class="auth__message">
        <slot name="message" />
      </p>
    </div>
  </section>
</template>
