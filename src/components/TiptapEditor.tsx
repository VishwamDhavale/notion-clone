"use client"

import React from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import TipTapManuBar from './TipTapManuBar'
import { Button } from './ui/button'
import { useDebounce } from '@/lib/useDebounce'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { NoteType } from "@/lib/db/schema";
import { useCompletion } from 'ai/react';

import Text from '@tiptap/extension-text'

type Props = { note: NoteType }

const TiptapEditor = ({ note }: Props) => {
    const [editorState, setEditorState] = React.useState(note.editorState || '')
    const [isLoading, setIsLoading] = React.useState(false)
    const { complete, completion } = useCompletion({
        api: '/api/completion',
    })


    const saveNote = useMutation({
        mutationFn: async () => {
            setIsLoading(true)
            const response = await axios.post('/api/saveNotes', {
                noteId: note.id,
                editorState
            })
            return response.data

        }
    })
    const customText = Text.extend({
        addKeyboardShortcuts() {
            return {
                'Alt-a': () => {
                    const prompt = this.editor.getText().split(" ").slice(-30).join(" ")
                    // console.log(prompt)
                    complete(prompt)
                    return true
                },
            }
        },
    })

    const editor = useEditor({
        autofocus: true,
        extensions: [StarterKit, customText],
        content: editorState,
        onUpdate: ({ editor }) => {
            setEditorState(editor.getHTML())
        }
    })
    const lastCompletion = React.useRef("")

    React.useEffect(() => {
        // console.log(completion)
        if (!editor || !completion) {
            return
        }
        const diff = completion.slice(lastCompletion.current.length)
        lastCompletion.current = completion
        editor.commands.insertContent(diff)

    }, [completion, editor])

    const debounceEditorState = useDebounce(editorState, 5000)
    React.useEffect(() => {
        if (debounceEditorState === '') {
            return
        }
        saveNote.mutate(undefined, {
            onSuccess: data => {
                setIsLoading(false)
                console.log("note save", data)
            },
            onError: error => {
                setIsLoading(false)
                console.log("note save error", error)
            }

        })
    }, [debounceEditorState])
    return (
        <>
            <div className='flex'>
                {editor && <TipTapManuBar editor={editor} />}
                <Button disabled variant={"outline"}
                >
                    {isLoading ? "Saving" : "Save"}
                </Button>
            </div>
            <div className='prose prose-sm w-full mt-4'>
                <EditorContent editor={editor} />
            </div>
            <div className="h-4"></div>
            <span className='text-sm'>
                Tip: Press
                <kbd className='px-2 py-1.5 text-xs font-semiboldtext-gray-800 bg-gray-100 border border-gray-200 rounded-lg '>
                    Alt + A
                </kbd>
                for AI autocomplete
            </span>

        </>

    )
}

export default TiptapEditor