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
    content: string;
};

const Toolbar = ({ editor, content }: Props) => {
    if (!editor) {
        return null;
    }
    return (
        <div
            className=""
        >
            <div className="flex justify-start items-center gap-2 w-full lg:w-10/12 flex-wrap ">


                <Toggle size="sm"
                        pressed={editor.isActive("bold")}
                        onPressedChange={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold className="h-4 w-4" />
                </Toggle>


                <Toggle size="sm"
                        pressed={editor.isActive("italic")}
                        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="h-4 w-4" />
                </Toggle>

                <Toggle size="sm"
                        pressed={editor.isActive("underline")}
                        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                >
                    <Underline className="h-4 w-4" />
                </Toggle>

                <Toggle size="sm"
                        pressed={editor.isActive("strike")}
                        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                >
                    <Strikethrough className="h-4 w-4" />
                </Toggle>


                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Heading className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-auto min-w-full">
                        <DropdownMenuItem>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("heading", { level: 1 })}
                                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            >
                                <Heading1 className="h-4 w-4" />
                            </Toggle>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("heading", { level: 2 })}
                                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            >
                                <Heading2 className="h-4 w-4" />
                            </Toggle>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("heading", { level: 3 })}
                                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            >
                                <Heading3 className="h-4 w-4" />
                            </Toggle>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("heading", { level: 4 })}
                                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                            >
                                <Heading4 className="h-4 w-4" />
                            </Toggle>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("heading", { level: 5 })}
                                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                            >
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
                    <DropdownMenuTrigger><Text className="h-4 w-4" /></DropdownMenuTrigger>
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
                >
                    <List className="h-4 w-4" />
                </Toggle>

                <Toggle size="sm"
                        pressed={editor.isActive("orderedList")}
                        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered className="h-4 w-4" />
                </Toggle>

                <Toggle size="sm"
                        pressed={editor.isActive("blockquote")}
                        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <Quote className="h-4 w-4" />
                </Toggle>

                <Toggle size="sm"
                        pressed={editor.isActive("code")}
                        onPressedChange={() => editor.chain().focus().setCode().run()}
                >
                    <Code className="h-4 w-4" />
                </Toggle>

                <Toggle size="sm"
                        pressed={editor.isActive("undo")}
                        onPressedChange={() => editor.chain().focus().undo().run()}
                >
                    <Undo className="h-4 w-4" />
                </Toggle>

                <Toggle size="sm"
                        pressed={editor.isActive("redo")}
                        onPressedChange={() => editor.chain().focus().redo().run()}
                >
                    <Redo className="h-4 w-4" />
                </Toggle>

            </div>

        </div>
    );
};

export default Toolbar;