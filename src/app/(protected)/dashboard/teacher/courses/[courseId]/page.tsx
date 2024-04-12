export default function CoursePage({ params }: { params: { courseId: string } }) {
    return <div>My Post: {params.courseId}</div>
}