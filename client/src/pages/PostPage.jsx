// PostsListPage.js (or SearchResultsPage.js, depending on your use case)

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams
import PostCard from '../components/PostCard'; // Assuming you have a PostCard component

const PostsListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams(); // Get search parameters from URL

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const searchQuery = searchParams.get('search') || ''; // Get search query
        const categoryFilter = searchParams.get('category') || ''; // Get category filter
        const sortOrder = searchParams.get('sort') || 'latest'; // Get sort order

        // Construct the API URL with search parameters and filters
        let apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/post/getPosts?`;

        if (searchQuery) {
          apiUrl += `search=${searchQuery}&`;
        }

        if (categoryFilter) {
          apiUrl += `category=${categoryFilter}&`;
        }

        if (sortOrder) {
          apiUrl += `sort=${sortOrder}&`;
        }

        const res = await fetch(apiUrl);
        const data = await res.json();

        if (res.ok) {
          setPosts(data.posts);
        } else {
          setError(data.message || 'Failed to fetch posts');
        }
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchParams]); // Re-fetch when search parameters change

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center min-h-screen text-red-500'>
        Error: {error}
      </div>
    );
  }

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        Posts Results
      </h1>

      {/* Add your search/filter UI components here */}
      {/* Example: */}
      <div className='flex flex-wrap gap-2 mt-5'>
        <select
          value={searchParams.get('sort') || 'latest'}
          onChange={(e) => {
            searchParams.set('sort', e.target.value);
            window.location.search = searchParams.toString();
          }}
        >
          <option value='latest'>Latest</option>
          <option value='oldest'>Oldest</option>
          {/* Add more sorting options if needed */}
        </select>

        <select
          value={searchParams.get('category') || ''}
          onChange={(e) => {
            searchParams.set('category', e.target.value);
            window.location.search = searchParams.toString();
          }}
        >
          <option value=''>All Categories</option>
          <option value='Uncategorized'>Uncategorized</option>
          {/* Add more category options from your API */}
        </select>

        <input
          type='text'
          placeholder='Search...'
          value={searchParams.get('search') || ''}
          onChange={(e) => {
            searchParams.set('search', e.target.value);
            window.location.search = searchParams.toString();
          }}
        />
      </div>

      {posts.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className='text-center text-gray-500 mt-5'>No posts found.</p>
      )}
    </main>
  );
};

export default PostsListPage;
