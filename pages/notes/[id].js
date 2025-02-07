import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export default function NotePage({ noteData }) {
    return (
        <div>
            <h1>{noteData.title}</h1>
            <p><strong>Published:</strong> {noteData.publishDate}</p>
            <div dangerouslySetInnerHTML={{ __html: noteData.contentHtml }} />
        </div>
    );
}

export async function getStaticPaths() {
    const notesDirectory = path.join(process.cwd(), 'content/notes');
    const fileNames = fs.readdirSync(notesDirectory);

    const paths = fileNames.map((fileName) => ({
        params: { id: fileName.replace(/\.md$/, '') },
    }));

    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const notesDirectory = path.join(process.cwd(), 'content/notes');
    const fullPath = path.join(notesDirectory, `${params.id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);

    let date = matterResult.data.date;
    let publishDate = matterResult.data.publish_date || date;

    // Convert dates to strings (if they exist)
    if (date instanceof Date) {
        date = date.toISOString().split('T')[0]; // YYYY-MM-DD
    }
    if (publishDate instanceof Date) {
        publishDate = publishDate.toISOString().split('T')[0];
    }

    // Process markdown content into HTML
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);

    return {
        props: {
            noteData: {
                id: params.id,
                title: matterResult.data.title || "Untitled",
                date: date || "Unknown Date",
                publishDate: publishDate || "Unknown Date",
                contentHtml: processedContent.toString(),
            },
        },
    };
}

