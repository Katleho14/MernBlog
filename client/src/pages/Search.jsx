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
    const searchTermFromUrl = urlParams.get('searchTerm') || '';
    const sortFromUrl = urlParams.get('sort') || 'desc';
    const categoryFromUrl = urlParams.get('category') || 'uncategorized';

    setSidebarData({
      searchTerm: searchTermFromUrl,
      sort: sortFromUrl,
      category: categoryFromUrl,
    });

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const url = `${import.meta.env.VITE_API_BASE_URL}/api/post/getPosts?${urlParams.toString()}`;
        console.log('Fetching search posts from:', url);
        const res = await fetch(url);

        if (!res.ok) throw new Error(`Error ${res.status}: Failed to fetch`);
        const data = await res.json();

        if (Array.isArray(data.posts)) {
          setPosts(data.posts);
          setShowMore(data.posts.length === 9);
        } else {
          setPosts([]);
          setShowMore(false);
        }
      } catch (error) {
        console.error('Error fetching posts:', error.message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    setSidebarData({ ...sidebarData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchQuery = new URLSearchParams({
      searchTerm: sidebarData.searchTerm,
      sort: sidebarData.sort,
      category: sidebarData.category,
    }).toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);

    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/post/getPosts?${urlParams.toString()}`;
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data.posts)) {
        setPosts((prev) => [...prev, ...data.posts]);
        setShowMore(data.posts.length === 10);
      }
    } catch (error) {
      console.error('Error fetching more posts:', error.message);
    }
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Search Term:</label>
            <TextInput
              placeholder='Search...'
              id='searchTerm'
              type='text'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <Select id='sort' value={sidebarData.sort} onChange={handleChange}>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Category:</label>
            <Select id='category' value={sidebarData.category} onChange={handleChange}>
              <option value='uncategorized'>Uncategorized</option>
              <option value='reactjs'>React.js</option>
              <option value='nextjs'>Next.js</option>
              <option value='javascript'>JavaScript</option>
            </Select>
          </div>
          <Button type='submit' outline gradientDuoTone='purpleToPink'>
            Apply Filters
          </Button>
        </form>
      </div>

      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>
          Post results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {loading && <p className='text-xl text-gray-500'>Loading...</p>}
          {!loading && posts.length === 0 && (
            <p className='text-xl text-gray-500'>No posts found.</p>
          )}
          {!loading &&
            posts.length > 0 &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
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

