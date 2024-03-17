"use client"
import React from 'react'
import { Button } from './ui/button'
import { Trash } from 'lucide-react'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

type Props = {
    noteId: number
}

const DeleteButton = ({ noteId }: Props) => {
    const router = useRouter()
    const deleteNote = useMutation({
        mutationFn: async () => {
            const respone = await axios.post('/api/deleteNote', {
                noteId
            })
            return respone.data
        }
    })
    return (
        <Button variant={'destructive'} size={"sm"} onClick={() => {
            const confirm = window.confirm("Are you sure you want to delete this note?")
            if (!confirm) {
                return
            }
            deleteNote.mutate(undefined, {
                onSuccess: () => {
                    router.push('/editor')
                },
                onError: (error) => {
                    alert('Failed to delete note')
                }

            })

        }}>
            <Trash />

        </Button>
    )
}

export default DeleteButton