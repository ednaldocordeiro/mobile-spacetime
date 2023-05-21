import { EmptyMemories } from '@/components/EmptyMemories'
import { api } from '@/lib/api'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import { ArrowRight } from 'lucide-react'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'

dayjs.locale(ptBr)
interface Memory {
  id: string
  coveryUrl: string
  content: string
  createdAt: string
}

export default async function Home() {
  const isAuthenticaded = cookies().has('token')

  if (!isAuthenticaded) {
    return <EmptyMemories />
  }

  const token = cookies().get('token')?.value
  const response = await api.get('/memories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memories: Memory[] = response.data
  if (memories.length === 0) {
    return <EmptyMemories />
  }

  return (
    <div className="flex flex-1 flex-col gap-10 p-16">
      {memories.map((memory) => (
        <div key={memory.id} className="space-y-4">
          <time className="-ml-16 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
            {dayjs(memory.createdAt).format('D [de] MMMM[,] YYYY')}
          </time>
          <Image
            src={memory.coveryUrl}
            width={1920}
            height={1080}
            alt="image"
            className="aspect-video w-full rounded-lg object-cover"
          />
          <p className="text-lg leading-relaxed text-gray-100">
            {memory.content}
          </p>

          <Link
            href={`memories/${memory.id}`}
            className="flex items-center gap-2 text-sm text-gray-200 hover:text-gray-100"
          >
            Ler mais <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ))}
    </div>
  )
}
