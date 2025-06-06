import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const url = `${import.meta.env.VITE_API_BASE_URL}/api/post/getPosts`;
        console.log('Fetching posts from:', url);

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);

        // Added try-catch for json parsing
        let data;
        try {
          data = await res.json();
        } catch (jsonError) {
          throw new Error('Failed to parse JSON: ' + jsonError.message);
        }

        setPosts(data?.posts || []);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
        setPosts([]); // Optional: clear posts on error
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>

      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {loading ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : posts.length > 0 ? (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="flex flex-wrap gap-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to="/search"
              className="text-lg text-teal-500 hover:underline text-center"
            >
              View all posts
            </Link>
          </div>
        ) : (
          <p className="text-center text-gray-500">No posts available.</p>
        )}
      </div>
    </div>
  );
}
