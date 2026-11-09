<template>
  <div class="space-y-2">
    <div v-if="label" class="flex items-center justify-between">
      <label class="block text-xs font-bold text-slate-700">{{ label }}</label>
      <span v-if="hint" class="text-[10px] text-slate-400">{{ hint }}</span>
    </div>

    <!-- Dropzone / Input de Arquivo -->
    <div
      class="relative rounded-2xl border-2 border-dashed transition p-4 flex flex-col items-center justify-center text-center cursor-pointer group"
      :class="[
        uploading ? 'bg-slate-100 border-slate-300 opacity-60 pointer-events-none' : 'bg-slate-50/70 hover:bg-emerald-50/50 border-slate-200 hover:border-emerald-500'
      ]"
      @click="triggerFileInput"
      @dragover.prevent
      @drop.prevent="onDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        class="hidden"
        @change="onFileSelected"
      />

      <!-- Preview da Imagem Selecionada -->
      <div v-if="modelValue" class="relative group/preview mb-2">
        <img
          :src="modelValue"
          alt="Preview"
          class="max-h-24 max-w-full rounded-xl object-contain border border-slate-200 bg-white shadow-2xs"
        />
        <button
          type="button"
          @click.stop="clearImage"
          class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center shadow-md hover:bg-rose-700 transition"
          title="Remover imagem"
        >
          ✕
        </button>
      </div>

      <!-- Ícone e Instruções -->
      <div v-else class="space-y-1.5 py-2">
        <div class="w-10 h-10 rounded-xl bg-white border border-slate-200 group-hover:border-emerald-300 flex items-center justify-center mx-auto text-slate-500 group-hover:text-emerald-600 shadow-2xs transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p class="text-xs font-bold text-slate-700 group-hover:text-emerald-800 transition">
            {{ uploading ? 'Enviando arquivo...' : (placeholder || 'Clique para escolher arquivo do seu computador') }}
          </p>
          <p class="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP ou SVG (Arquivo real salvo no servidor)</p>
        </div>
      </div>

      <div v-if="uploading" class="mt-2 flex items-center space-x-1.5 text-xs text-emerald-700 font-bold">
        <svg class="animate-spin w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span>Salvando no servidor...</span>
      </div>
    </div>

    <!-- Feedback de erro -->
    <p v-if="errorMsg" class="text-xs font-semibold text-rose-600 animate-fade-in">{{ errorMsg }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue?: string
  label?: string
  placeholder?: string
  hint?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const errorMsg = ref('')

const { fetchWithAuth } = useAuth()

const triggerFileInput = () => {
  fileInput.value?.click()
}

const onFileSelected = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    uploadFile(target.files[0])
  }
}

const onDrop = (e: DragEvent) => {
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    uploadFile(e.dataTransfer.files[0])
  }
}

const clearImage = () => {
  emit('update:modelValue', '')
  if (fileInput.value) fileInput.value.value = ''
}

const uploadFile = async (file: File) => {
  errorMsg.value = ''
  uploading.value = true

  try {
    const formData = new FormData()
    formData.append('file', file)

    const res: any = await fetchWithAuth('/api/admin/upload', {
      method: 'POST',
      body: formData
    })

    if (res?.url) {
      emit('update:modelValue', res.url)
    } else {
      throw new Error('Não foi possível obter a URL do arquivo salvo.')
    }
  } catch (err: any) {
    errorMsg.value = err.data?.statusMessage || err.message || 'Erro ao fazer upload do arquivo.'
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}
</script>

