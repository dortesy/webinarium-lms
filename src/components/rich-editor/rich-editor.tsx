'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {Field, useController, UseControllerProps} from "react-hook-form";
import Underline from "@tiptap/extension-underline";
import Toolbar from "@/components/rich-editor/toolbar";
import {TextAlign} from "@tiptap/extension-text-align";

import { useFormContext } from 'react-hook-form';
import BaseHeading from '@tiptap/extension-heading'
import { mergeAttributes } from '@tiptap/core'

type Levels = 1 | 2 | 3 | 4 | 5 | 6

const classes: Record<Levels, string> = {
    1: 'text-4xl',
    2: 'text-3xl',
    3: 'text-2xl',
    4: 'text-xl',
    5: 'text-lg',
    6: 'text-base',
}

export const Heading = BaseHeading.configure({ levels: [1, 2, 3, 4, 5, 6] }).extend({
    renderHTML({ node, HTMLAttributes }) {
        const hasLevel = this.options.levels.includes(node.attrs.level)
        const level: Levels = hasLevel ? node.attrs.level : this.options.levels[0]

        return [
            `h${level}`,
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                class: `${classes[level]}`,
            }),
            0,
        ]
    },
})


interface RichEditorProps {
    value: string | "";        // assuming the value is a string, adjust based on your actual data structure
    name: string;
    disabled?: boolean;
    onChange: (newValue: string) => void;  // the type of newValue should match the expected new value type
}

const RichEditor = ({ value, name, disabled, onChange, }: RichEditorProps) => {

    console.log('render rich editor')

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc pl-4 '
                    }
                },

                orderedList:{
                    HTMLAttributes: {
                        class: 'list-decimal pl-4'
                    }
                },

                blockquote: {
                    HTMLAttributes: {
                        class: 'border-l-4 border-gray-300 pl-2'
                    }
                },

                codeBlock: {
                    HTMLAttributes: {
                        class: 'bg-gray-100 p-2'
                    }
                },
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),

            Heading.configure(
                {
                    levels: [1, 2, 3, 4, 5, 6],
                    HTMLAttributes: {
                        class: 'font-bold'
                    }
                },
            )

        ],
        editorProps: {
            attributes: {
                class: 'rounded-md border min-h-[150px] border-input bg-white p-2',
            },
        },

        content: value || '',

        onUpdate({ editor }) {
            onChange(editor.getHTML())
        },
    })

    if(!editor) {
        return null
    }

    return (
        <div className="w-full flex flex-col justify-stretch">
            <Toolbar editor={editor} content={value} />
            <EditorContent editor={editor}  className={disabled ? 'opacity-50 cursor-not-allowed' : ''}/>
        </div>
    )
}

export default RichEditor