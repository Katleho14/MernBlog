import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    setSidebarData({
      searchTerm: urlParams.get('searchTerm') || '',
      sort: urlParams.get('sort') || 'desc',
      category: urlParams.get('category') || 'uncategorized',
    });

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/post/getPosts?${urlParams.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();

        if (data.success && Array.isArray(data.posts)) {
          setPosts(data.posts);
          setShowMore(data.posts.length === 9); // your page size
        } else {
          console.warn('Unexpected data structure:', data);
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/post/getPosts?${urlParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch more posts');
      const data = await res.json();

      if (data.success && Array.isArray(data.posts)) {
        setPosts((prev) => [...prev, ...data.posts]);
        setShowMore(data.posts.length === 9);
      }
    } catch (error) {
      console.error('Error fetching more posts:', error);
    }
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold' htmlFor='searchTerm'>
              Search Term:
            </label>
            <TextInput
              placeholder='Search...'
              id='searchTerm'
              type='text'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold' htmlFor='sort'>Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold' htmlFor='category'>Category:</label>
            <Select onChange={handleChange} value={sidebarData.category} id='category'>
              <option value='uncategorized'>Uncategorized</option>
              <option value='reactjs'>React.js</option>
              <option value='nextjs'>Next.js</option>
              <option value='javascript'>JavaScript</option>
              <option value='tech'>Tech</option>
            </Select>
          </div>
          <Button type='submit' outline gradientDuoTone='purpleToPink'>
            Apply Filters
          </Button>
        </form>
      </div>

      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>
          Posts results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {loading && <p className='text-xl text-gray-500'>Loading...</p>}
          {!loading && posts.length === 0 && (
            <p className='text-xl text-gray-500'>No posts found.</p>
          )}
          {!loading && posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className='text-teal-500 text-lg hover:underline p-7 w-full'
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

