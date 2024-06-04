import * as React from "react"
import {cn} from "@/lib/utils"
interface LogoSVGProps {
  className: string
}

const LogoSVG = ({...props}: LogoSVGProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    data-name="Layer 1"
    viewBox="0 0 894 129"
    {...props}
  >
    <path
      d="M762.89 45.01c11.46-8.79 23.12-10.36 35.4-8.98 7.62.86 14.75 3.23 20.3 8.68 2.92 2.86 4.89 2.8 7.98.31 13.29-10.71 28.41-11.66 43.97-6.69 13.61 4.35 20.5 14.82 21.07 28.66.74 18.13.38 36.3.54 54.46.02 2.69-1.06 3.96-3.85 3.92-7.16-.12-14.33-.2-21.49-.12-3.56.04-4.02-1.98-4-4.83.06-11.99.04-23.99.04-35.98 0-2.16 0-4.34-.14-6.49-.68-10.12-6.55-16-16.07-16.16-9.49-.17-16.08 5.45-16.6 15.58-.66 12.79-.37 25.64-.48 38.46-.01 1.5-.07 3.01.07 4.5.33 3.58-1 5.14-4.81 4.99-6.65-.25-13.33-.27-19.99-.08-3.76.11-4.97-1.45-4.95-5.02.07-13.99.23-27.99-.11-41.98-.32-12.94-10.81-19.79-22.88-15.35-6.11 2.25-9.59 6.79-9.96 13.13-.51 8.8-.48 17.63-.59 26.45-.07 5.83-.19 11.67.09 17.49.21 4.22-1.46 5.56-5.52 5.38-6.15-.27-12.33-.34-18.48-.07-4.09.18-5.13-1.52-5.11-5.28.13-21.16.09-42.31.12-63.47 0-4.16.2-8.34.02-12.49-.16-3.82 1.28-5.51 5.21-5.35 4.82.2 9.66.06 14.49.11 3.24.03 6.32.34 5.75 6.21ZM247.68 122.51c-1.99.84-3.95 2.26-5.99 2.41-5.14.37-10.33-.05-15.48.26-4.43.27-5.28-1.84-5.24-5.71.26-22.48.4-44.97.5-67.45.06-11.99.12-23.99-.16-35.97-.09-4.07 1.32-5.27 5.18-5.07 5.32.28 10.66.27 15.98.11 3.71-.11 4.97 1.39 4.89 5.03-.18 8.62-.06 17.24-.06 25.99.84 0 1.39.16 1.75-.02 17.48-9.05 34.58-4.44 43.36 13.2 9.39 18.88 9.97 38.44-2.14 56.57-10.04 15.03-24.51 17.72-42.61 10.65Zm-2.22-40.25c-.03 9.08 5.92 15.28 14.77 15.39 8.95.12 15.61-6.73 15.51-15.92-.09-8.34-6.63-14.64-15.14-14.58-8.74.05-15.12 6.41-15.15 15.11ZM365.39 43.01c7.83-2.38 14.92-5.77 22.28-6.54 21.91-2.31 36.73 10.08 37.98 32.01 1 17.62.45 35.32.62 52.98.03 2.68-1.03 3.98-3.84 3.93-6.66-.11-13.33-.21-20-.09-3.96.07-4.14-2.37-4.11-5.27.1-12 .26-24 .17-36-.02-3.46-.34-7.05-1.32-10.35-2.04-6.9-8.22-10.95-15.2-10.59-6.47.33-11.59 4.71-13.15 11.73-.68 3.06-.84 6.27-.86 9.42-.07 12-.1 24 .12 36 .08 3.98-1.37 5.29-5.23 5.14-6.32-.25-12.67-.27-19-.11-3.57.09-4.6-1.44-4.57-4.78.22-25.67.37-51.33.43-77 0-3.51 1.49-4.79 4.79-4.73 4.67.09 9.33.09 14 .05 3.69-.03 7.43-.23 6.88 4.19ZM160.22 90.96c3.16 9.93 13.91 13.56 22.92 8.11 9.1-5.51 18.79-2.56 28.23-2.83 3.33-.09 2.47 2.95 1.55 4.93-5.25 11.34-12.99 20.21-25.39 23.8-16.55 4.78-32.16 2.6-44.48-9.88-12.55-12.72-13.94-28.77-8.81-45.19 6.94-22.2 26.65-35.37 47.29-32.41 16.46 2.36 28.86 13.19 32.78 29.46 1.43 5.92 1.47 12.18 2.06 18.29.4 4.16-1.38 5.98-5.78 5.92-14.81-.22-29.62-.16-44.44-.2h-5.93Zm-.32-15.21c8.88 0 17.32.05 25.75-.02 5.75-.04 6.95-2.05 4.63-7.46-2.46-5.73-8.75-8.55-16.47-7.37-7.62 1.16-13.09 6.52-13.91 14.85ZM729.35 66.62c0 7.66.46 15.35-.09 22.97-1.29 17.77-12.43 30.82-29.7 35.27-9.66 2.49-19.42 2.89-29.18.43-15.74-3.97-26.27-14.94-27.37-31.13-1.16-17.08-.72-34.28-.7-51.43 0-1.3 2.12-3.65 3.36-3.72 7.14-.42 14.32-.33 21.48-.37 3.32-.02 3.53 2.25 3.51 4.8-.09 10-.12 19.99-.17 29.99-.01 2.83-.09 5.67.02 8.5.42 11.47 5.57 17.1 15.72 17.24 9.94.14 15.43-5.11 15.91-16.41.53-12.48.36-24.98.42-37.47.03-6.61.21-6.86 6.6-6.76 4.66.07 9.33.12 13.99.16 6.19.05 6.62.46 6.62 6.44v21.49h-.41ZM493.9 42.82c.85-4.23 4.02-4.42 7.61-4.23 3.82.2 7.66.09 11.49-.03 3.47-.11 5.2 1.13 5.19 4.9-.06 25.82-.04 51.64.04 77.46.01 3.22-1.19 4.48-4.43 4.35-5.32-.22-11.22 1.26-15.85-.58-6.12-2.43-10.77.23-15.98 1.4-23.8 5.34-45.74-9.95-48.7-35.69-1.83-15.96-.93-32.25-.96-48.39 0-1.13 2.43-3.21 3.75-3.24 14.98-.29 29.98-.57 44.95-.15 4.08.12 8.1 2.57 12.87 4.2Zm-43.13 42.29c-.02 14.55 9.44 24.8 22.96 24.87 14.01.08 24.3-10.09 24.44-24.15.14-13.59-10.22-23.9-24.05-23.93-13.7-.03-23.34 9.54-23.36 23.2Zm15.38-45.47c-1.89.31-2.85.2-3.5.61-7.45 4.63-14.9 9.26-22.17 14.16-.67.45-.65 3.48.08 4.1 1.24 1.05 3.76 2.06 4.94 1.47 7.56-3.8 15-7.89 22.25-12.27 1.46-.89 2.92-3.71 2.54-5.17-.37-1.42-3.09-2.23-4.13-2.89ZM594.85 68.84c-5.95-1.36-11.33-3.46-16.79-3.68-13.32-.52-22.44 7.5-23.39 20.76-.8 11.11-.66 22.31-.39 33.46.12 4.99-1.53 6.38-6.26 6.07-5.81-.38-11.66-.28-17.49-.12-3.51.1-4.66-1.34-4.64-4.73.17-25.82.27-51.65.28-77.47 0-3.57 1.61-4.69 4.88-4.57 4.16.15 8.33.15 12.49.13q8.51-.03 10.34 8.51c1.6-1.26 2.97-2.33 4.33-3.4 11.14-8.81 23.35-9.64 36.3-4.88 4.17 1.54 6 4.19 4.86 8.91-1.45 5.98-2.32 12.1-3.52 18.14-.24 1.22-.84 2.37-1.02 2.86ZM92.16 51.14c2.55 7.61 4.78 14.29 7.01 20.97.46.09.93.18 1.39.26.91-2.14 2.02-4.21 2.71-6.42 3.68-11.76 7.08-23.61 10.92-35.32 3.23-9.85 10.18-13.83 19.1-11.51 6.94 1.8 10.52 7.74 8.26 14.51-9.25 27.65-18.6 55.26-28.02 82.85-2.12 6.22-6.78 9.23-13.35 9.26-6.43.04-11.77-3.04-13.83-8.75-3.22-8.93-6.09-17.99-8.91-27.06-.51-1.65-.6-3.8 0-5.36 4.06-10.39 8.36-20.69 12.63-31.01.23-.57.83-.98 2.1-2.42ZM49.4 56.38c4.63 10.09 9.32 20.17 13.83 30.31.47 1.06.23 2.66-.17 3.84-2.87 8.51-5.68 17.06-8.89 25.45-2.7 7.06-7.38 9.98-14.08 9.61-6.74-.38-11.05-3.86-13.21-10.92-8.01-26.26-16-52.53-23.96-78.8C.53 28 2.84 22.14 9.18 19.6c7.55-3.02 15.53-.34 18.16 7.36 4.35 12.74 7.71 25.81 11.5 38.74.59 2.03 1.23 4.04 1.85 6.06.45.08.89.16 1.34.23 1.96-5.24 3.93-10.47 5.89-15.71.49.03.99.07 1.48.1ZM607.05 82.02c0-12.49.13-24.98-.07-37.46-.07-4.23 1.17-6.1 5.64-5.9 5.65.26 11.32.09 16.98-.04 3.45-.08 5.25 1.08 5.24 4.87-.06 25.81-.05 51.62.03 77.42 0 3.21-1.17 4.48-4.41 4.39-6.16-.18-12.33-.32-18.48-.04-4.11.19-5.16-1.54-5.13-5.28.13-12.65.05-25.31.05-37.96h.15ZM331.28 81.98c0 12.81-.1 25.63.06 38.44.05 3.63-.96 5.11-4.81 4.87-5.14-.33-10.31-.14-15.47-.15q-7.25-.01-7.23-7.5c.04-22.97.02-45.93.12-68.9.04-10.05-2.17-10.24 10.26-9.95 3.66.09 7.33.09 10.98-.19 4.45-.33 6.23 1.19 6.12 5.93-.28 12.48-.1 24.96-.1 37.44h.08ZM69.23 71.29C64.53 60.87 59.1 51.02 55.7 40.52c-2.11-6.53.64-13.64 5.95-18.59 4.54-4.23 10.19-4.54 15.89-2.23 5.65 2.29 9.16 8.55 7.14 14.23-4.35 12.21-9.22 24.24-13.91 36.33-.09.24-.51.36-1.54 1.04ZM603.92 17.48c-.03-9.04 7.33-16.43 16.48-16.52 8.85-.09 15.71 6.52 15.76 15.17.06 9.18-7.21 16.79-16.15 16.91-8.83.11-16.06-6.87-16.09-15.56ZM301.46 17.39C301.46 8 308.63.73 317.81.82c8.72.08 15.66 6.92 15.72 15.49.06 8.88-7.75 16.74-16.55 16.65-8.75-.08-15.52-6.88-15.52-15.57Z"
      className={cn("fill-current text-primary", props.className)}
    />
  </svg>
)
export default LogoSVG
