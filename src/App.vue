<script setup>
import { RouterView } from 'vue-router'
import { useSupabase } from './composables/useSupa'

const { supabase } = useSupabase()
if (supabase) {
  console.log('exito')
}
</script>

<template>
  <div>
    <router-view class="bg-gray-900"></router-view>
  </div>
</template>
