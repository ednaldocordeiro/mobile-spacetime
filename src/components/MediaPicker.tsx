'use client'

import Image from 'next/image'
import { ChangeEvent, useState } from 'react'

interface MediaPickerProps {
  defaultPreview: string | undefined
}

export function MediaPicker({ defaultPreview }: MediaPickerProps) {
  const [preview, setPreview] = useState<string | null>(null)
  function onFileSelected(e: ChangeEvent<HTMLInputElement>) {
    const { files } = e.target

    if (!files) return

    const preview = URL.createObjectURL(files[0])
    setPreview(preview)
  }

  return (
    <>
      <input
        onChange={onFileSelected}
        name="coverUrl"
        type="file"
        id="media"
        className="invisible h-0 w-0"
        accept="image/*"
      />
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt=""
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}

      {!preview && defaultPreview && (
        <Image
          className="aspect-video w-full rounded-lg object-cover"
          src={defaultPreview}
          width={1920}
          height={1080}
          alt="preview"
        />
      )}
    </>
  )
}
