import {Messages} from "@/i18n";
import messages from "@/messages/ru.json";
import uzMessages from "@/messages/uz.json";
export type Messages = typeof messages;
export type uzMessages = typeof messages;

declare global {
    interface IntlMessages extends Messages, uzMessages {}
}