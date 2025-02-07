import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const notesDirectory = path.join(process.cwd(), 'content/notes');

export function getSortedNotesData() {
    const fileNames = fs.readdirSync(notesDirectory);

    const allNotesData = fileNames.map((fileName) => {
        const id = fileName.replace(/\.(md|txt)$/, ''); // Remove file extension
        const fullPath = path.join(notesDirectory, `${id}.md`); // Always assume .md
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Parse frontmatter
        const matterResult = matter(fileContents);

        let title = matterResult.data.title || "Untitled Note";
        let date = matterResult.data.date;
        let publishDate = matterResult.data.publish_date || date; // Use publish_date if available

        // Ensure date & publishDate are properly formatted as strings
        if (!date) date = new Date().toISOString().split('T')[0]; // Default to today
        if (!publishDate) publishDate = date; // If missing, use date

        // Convert to Date objects for comparison
        const now = new Date();
        const publishDateObj = new Date(publishDate);

        return {
            id,
            title,
            date: new Date(date).toISOString().split('T')[0], // Store as YYYY-MM-DD
            publishDate: publishDateObj.toISOString().split('T')[0],
            content: matterResult.content, // Markdown content
        };
    });

    // Filter out future posts (only show posts with publish_date in the past)
    return allNotesData
        .filter(post => new Date(post.publishDate) <= new Date()) // Only show past posts
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by newest first
}

