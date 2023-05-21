'use client'

import { Camera } from 'lucide-react'
import { FormEvent } from 'react'
import { MediaPicker } from './MediaPicker'

import { api } from '@/lib/api'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

interface NewMemoryFormProps {
  disabled?: boolean
  memory?: {
    id: string
    coveryUrl: string
    content: string
    createdAt: string
    isPublic: boolean
  }
  isEdition?: boolean
  onSubmitEdit?: () => void
}

export function NewMemoryForm({
  disabled,
  memory,
  isEdition,
  onSubmitEdit,
}: NewMemoryFormProps) {
  const router = useRouter()
  async function handleCreateOrUpdateMemory(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const fileToUpload = formData.get('coverUrl')

    let coverUrl

    if (fileToUpload) {
      const uploadFormData = new FormData()
      uploadFormData.set('file', fileToUpload)

      const { data } = await api.post('/upload', uploadFormData)

      coverUrl = data.fileUrl
    } else {
      coverUrl = memory!.coveryUrl
    }
    const token = Cookies.get('token')

    const body = {
      coverUrl,
      content: formData.get('content'),
      isPublic: formData.get('isPublic'),
    }

    if (!isEdition) {
      await api.post('/memories', body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      router.push('/')
    } else {
      await api.put(`/memories/${memory!.id}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      onSubmitEdit && onSubmitEdit()
    }
  }

  return (
    <form
      onSubmit={handleCreateOrUpdateMemory}
      className="flex flex-1 flex-col gap-2"
    >
      <div className="flex items-center gap-4">
        {!disabled && (
          <label
            htmlFor="media"
            className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
          >
            <Camera className="h-4 w-4" />
            Anexar mídia
          </label>
        )}
        <label
          htmlFor="isPublic"
          className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            value="true"
            className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500"
            defaultChecked={memory?.isPublic ?? false}
            disabled={disabled ?? false}
          />
          Tornar memória pública
        </label>
      </div>

      <MediaPicker defaultPreview={memory?.coveryUrl} />

      <textarea
        name="content"
        spellCheck={false}
        className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed placeholder:text-gray-400 focus:ring-0"
        placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        defaultValue={memory?.content}
        disabled={disabled ?? false}
      />

      {!disabled && (
        <button
          type="submit"
          className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm leading-none text-black hover:bg-green-600"
        >
          Salvar
        </button>
      )}
    </form>
  )
}
