<template>
  <div class="bg-zinc-600 h-screen flex justify-center items-center text-amber-100">
    <div class="max-w-[350px] w-full">
      <Todo />
      <template v-if="false">
        <NuxtRouteAnnouncer />
        <NuxtWelcome />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { } from 'vue';

import Todo from '~/components/Todo.vue';

</script>
<style>
@import '~/public/style.css';
</style>