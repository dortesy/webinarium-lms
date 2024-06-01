"use client";

import React from "react";
import { type Editor } from "@tiptap/react";
import {
    Bold,
    Strikethrough,
    Italic,
    List,
    ListOrdered,
    Heading2,
    Underline,
    Quote,
    Undo,
    Redo,
    Code,
    Text, AlignLeft, AlignRight, AlignCenter, AlignJustify, Heading6, Heading5, Heading4, Heading3, Heading1, Heading,
} from "lucide-react";
import {Toggle} from "@/components/ui/toggle";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";

type Props = {
    editor: Editor | null;
    content: string | "";
};

const Toolbar = ({ editor, content }: Props) => {
    if (!editor) {
        return null;
    }
    return (
        <div className="mb-2" >
           
            <div className="flex justify-start items-center gap-2 w-full lg:w-10/12 flex-wrap ">


                <Toggle size="sm"
                        pressed={editor.isActive("bold")}
                        onPressedChange={() => editor.chain().focus().toggleBold().run()}
                        tabIndex={-1}>
                    <Bold className="h-4 w-4" />
                </Toggle>


                <Toggle size="sm"
                        pressed={editor.isActive("italic")}
                        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                        tabIndex={-1}>
                    <Italic className="h-4 w-4" />
                </Toggle>

                <Toggle size="sm"
                        pressed={editor.isActive("underline")}
                        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                        tabIndex={-1}>
               
                    <Underline className="h-4 w-4" />
                </Toggle>

                <Toggle size="sm"
                        pressed={editor.isActive("strike")}
                        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                        tabIndex={-1}>
                
                    <Strikethrough className="h-4 w-4" />
                </Toggle>


                <DropdownMenu>  
                    <DropdownMenuTrigger tabIndex={-1}>
                        <Heading className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-auto min-w-full">
                        <DropdownMenuItem>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("heading", { level: 1 })}
                                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                tabIndex={-1}>
                                <Heading1 className="h-4 w-4" />
                            </Toggle>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("heading", { level: 2 })}
                                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                tabIndex={-1}>
                                <Heading2 className="h-4 w-4" />
                            </Toggle>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("heading", { level: 3 })}
                                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                tabIndex={-1}>
                                <Heading3 className="h-4 w-4" />
                            </Toggle>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("heading", { level: 4 })}
                                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                                tabIndex={-1}>
                                <Heading4 className="h-4 w-4" />
                            </Toggle>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("heading", { level: 5 })}
                                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 5 }).run() }
                                tabIndex={-1}>
                                <Heading5 className="h-4 w-4" />
                            </Toggle>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("heading", { level: 6 })}
                                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                            >
                                <Heading6 className="h-4 w-4" />
                            </Toggle>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger tabIndex={-1}><Text className="h-4 w-4" /></DropdownMenuTrigger>
                    <DropdownMenuContent className="w-auto min-w-full">
                        <DropdownMenuItem>
                        <Toggle size="sm"
                                pressed={editor.isActive("TextAlign")}
                                onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}>
                            <AlignLeft className="h-4 w-4" />
                        </Toggle>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Toggle size="sm"
                                    pressed={editor.isActive("TextAlign")}
                                    onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}>
                                <AlignRight className="h-4 w-4" />
                            </Toggle>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Toggle size="sm"
                                    pressed={editor.isActive("TextAlign")}
                                    onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}>
                                <AlignCenter className="h-4 w-4" />
                            </Toggle>

                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Toggle size="sm"
                                    pressed={editor.isActive("TextAlign")}
                                    onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}>
                                <AlignJustify className="h-4 w-4" />
                            </Toggle>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>





                <Toggle size="sm"
                        pressed={editor.isActive("bulletList")}
                        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                        tabIndex={-1}
                >
                    <List className="h-4 w-4" />
                </Toggle>

                <Toggle size="sm"
                        pressed={editor.isActive("orderedList")}
                        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                        tabIndex={-1}
                >
                    <ListOrdered className="h-4 w-4" />
                </Toggle>

                <Toggle size="sm"
                        pressed={editor.isActive("blockquote")}
                        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                        tabIndex={-1}
                >
                    <Quote className="h-4 w-4" />
                </Toggle>

                <Toggle size="sm"
                        pressed={editor.isActive("code")}
                        onPressedChange={() => editor.chain().focus().setCode().run()}
                        tabIndex={-1}
                >
                    <Code className="h-4 w-4" />
                </Toggle>

                <Toggle size="sm"
                        pressed={editor.isActive("undo")}
                        onPressedChange={() => editor.chain().focus().undo().run()}
                        tabIndex={-1}
                >
                    <Undo className="h-4 w-4" />
                </Toggle>

                <Toggle size="sm"
                        pressed={editor.isActive("redo")}
                        onPressedChange={() => editor.chain().focus().redo().run()}
                        tabIndex={-1}
                >
                    <Redo className="h-4 w-4" />
                </Toggle>

            </div>

        </div>
    );
};

export default Toolbar;