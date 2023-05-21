'use client'

import { NewMemoryForm } from '@/components/NewMemoryForm'
import { api } from '@/lib/api'
import Cookies from 'js-cookie'
import { ChevronLeft, Pen, Trash, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface MemoryProps {
  params: {
    id: string
  }
}

interface MemoryType {
  id: string
  coveryUrl: string
  content: string
  createdAt: string
  isPublic: boolean
}

export default function Memory({ params }: MemoryProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [memory, setMemory] = useState({} as MemoryType)
  const token = Cookies.get('token')

  const router = useRouter()

  async function fetchMemory() {
    const response = await api.get(`/memories/${params.id}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })

    setMemory(response.data)
  }

  async function handleSubmitEdit() {
    await fetchMemory()
    setIsEditing(false)
  }

  async function handleDeleteMemory() {
    await api.delete(`/memories/${params.id}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })

    router.push('/')
  }

  useEffect(() => {
    fetchMemory()
  }, [])

  return (
    <div className="flex flex-1 flex-col gap-4 p-16">
      <Link
        href="/"
        as="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft /> Voltar a timeline
      </Link>
      <div className="flex gap-4 self-end">
        {!isEditing ? (
          <div
            className="flex cursor-pointer items-center justify-center rounded-full bg-gray-500 p-3"
            onClick={() => setIsEditing(true)}
          >
            <Pen className="h-4 w-4" />
          </div>
        ) : (
          <div
            className="flex cursor-pointer items-center justify-center rounded-full bg-slate-500 p-3"
            onClick={() => setIsEditing(false)}
          >
            <X className="h-4 w-4 text-white" />
          </div>
        )}
        <button
          className="flex cursor-pointer items-center justify-center rounded-full bg-red-500 p-3"
          onClick={() => handleDeleteMemory()}
          disabled={isEditing}
        >
          <Trash className="h-4 w-4 text-black" />
        </button>
      </div>
      <NewMemoryForm
        disabled={!isEditing}
        memory={memory}
        isEdition={true}
        onSubmitEdit={handleSubmitEdit}
      />
    </div>
  )
}
