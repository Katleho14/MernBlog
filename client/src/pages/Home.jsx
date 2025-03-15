import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Set loading to true before fetching
      setError(null); // Reset error state

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/post/getPosts`); // Use the correct URL with environment variable
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`); // Throw an error if the response is not ok
        }
        const data = await res.json();
        setPosts(data.posts);
      } catch (err) {
        setError(err.message || 'Failed to fetch posts'); // Set error state if fetching fails
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false); // Set loading to false after fetching (success or failure)
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading posts...</div>; // Render loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Render error state
  }

  return (
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Blog</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        <Link
          to='/search'
          className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
        >
          View all posts
        </Link>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {posts && posts.length > 0 ? ( // Use ternary operator for conditional rendering
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex flex-wrap gap-4'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              View all posts
            </Link>
          </div>
        ) : (
          <div>No posts available.</div> // Render message if no posts
        )}
      </div>
    </div>
  );
}