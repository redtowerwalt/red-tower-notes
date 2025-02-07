import Head from 'next/head';
import Link from 'next/link';
import { getSortedNotesData } from '../lib/posts';

export default function Home({ allNotesData }) {
    return (
        <div>
            <Head>
                <title>Red Tower Notes</title>
            </Head>
            <h1>📝 Red Tower Notes</h1>
            <ul>
                {allNotesData.map(({ id, title, date }) => (
                    <li key={id}>
			<Link href={`/notes/${id}`}>{title}</Link>
                        <br />
                        <small>{date}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Fetch notes at build time
export async function getStaticProps() {
    const allNotesData = getSortedNotesData();
    return {
        props: { allNotesData },
    };
}

