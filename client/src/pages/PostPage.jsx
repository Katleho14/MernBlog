import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import PostCard from '../components/PostCard';
import DOMPurify from 'dompurify';

const PostPage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  // Fetch a single post by slug
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError('');

        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/post/getPost/${encodeURIComponent(postSlug)}`;
        const res = await fetch(apiUrl);

        if (!res.ok) {
          throw new Error(`Post not found (status ${res.status})`);
        }

        const data = await res.json();

        if (!data || !data.post) {
          throw new Error(data.message || 'Post not found.');
        }

        setPost(data.post);
      } catch (err) {
        console.error('Fetch Post Error:', err.message);
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  // Fetch recent posts
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/post/getPosts?limit=3`);
        const data = await res.json();
        if (res.ok && data.success) {
          setRecentPosts(data.posts);
        }
      } catch (err) {
        console.error('Error fetching recent posts:', err.message);
      }
    };

    fetchRecentPosts();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='flex justify-center items-center min-h-screen text-red-500 text-center px-4'>
        <div>
          <p className='text-lg font-semibold'>Error loading post:</p>
          <p className='mt-2'>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post?.title}
      </h1>
      <Link to={`/search?category=${post?.category}`} className='self-center mt-5'>
        <Button color='gray' pill size='xs'>
          {post?.category}
        </Button>
      </Link>
      <img
        src={post?.image}
        alt={post?.title}
        className='mt-10 p-3 max-h-[600px] w-full object-cover'
      />
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{post?.createdAt && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>
          {post?.content?.length ? Math.ceil(post.content.length / 1000) : 0} mins read
        </span>
      </div>

      {post?.content && (
        <div
          className='p-3 max-w-2xl mx-auto w-full post-content'
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        ></div>
      )}

      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />
      </div>

      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Recent articles</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentPosts.length > 0 ? (
            recentPosts.map((recentPost) => (
              <PostCard key={recentPost._id || recentPost.id} post={recentPost} />
            ))
          ) : (
            <p className='text-center text-gray-500'>No recent posts available.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default PostPage;


