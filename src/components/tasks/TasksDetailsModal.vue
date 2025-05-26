<template>
  <Dialog :open="open" @update:open="handleClose">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>{{ task.title }}</DialogTitle>
        <DialogDescription>
          <div class="text-sm text-muted-foreground">
            Priorytet: {{ task.priority }} · Status: {{ task.status }}
          </div>
        </DialogDescription>
      </DialogHeader>

      <div class="mt-4 space-y-2">
        <p class="text-sm text-gray-600">{{ task.description }}</p>

        <div v-if="task.subtasks?.length" class="mt-4">
          <h4 class="font-medium text-sm mb-2">Podzadania:</h4>
          <ul class="space-y-1">
            <li v-for="subtask in task.subtasks" :key="subtask.id" class="flex items-center">
              <input type="checkbox" :checked="subtask.completed" disabled class="mr-2" />
              <span :class="{ 'line-through text-muted-foreground': subtask.completed }">
                {{ subtask.title }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <DialogFooter class="mt-6 flex justify-between">
        <div class="space-x-2">
          <Button variant="destructive" @click="handleDelete">
            Usuń
          </Button>
        </div>
        <div class="space-x-2">
          <Button variant="outline" @click="handleClose">Zamknij</Button>
          <Button @click="emitEdit">Edytuj</Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'edit', task: Task): void
  (e: 'delete', taskId: string): void
}>()

const props = defineProps<{
  open: boolean
  task: Task
}>()

const handleClose = () => {
  emit('close')
}

const emitEdit = () => {
  emit('edit', props.task)
}

const handleDelete = () => {
  emit('delete', props.task.id)
}
</script>
