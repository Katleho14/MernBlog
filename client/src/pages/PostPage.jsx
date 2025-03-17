
import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import PostCard from '../components/PostCard';
import DOMPurify from 'dompurify';

const PostPage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(false);

        console.log(`Fetching post with slug: ${postSlug}`);

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/post/getPost?slug=${postSlug}`);
        console.log("Full API URL:", `${import.meta.env.VITE_API_BASE_URL}/api/post/getPost?slug=${postSlug}`);
        const data = await res.json();

        console.log("API Response:", data);

        if (!res.ok || !data.success || !data.posts || data.posts.length === 0) {
          throw new Error(data.message || "Post not found");
        }

        setPost(data.posts[0]);
      } catch (err) {
        console.error("Fetch Post Error:", err.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/post/getPosts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      } catch (err) {
        console.error('Error fetching recent posts:', err.message);
      }
    };
    fetchRecentPosts();
  }, []);

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );

  if (error)
    return (
      <div className='flex justify-center items-center min-h-screen text-red-500'>
        Error loading post. Please try again later.
      </div>
    );

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post?.title}
      </h1>
      <Link
        to={`/search?category=${post?.category}`}
        className='self-center mt-5'
      >
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
          {post?.content?.length ? (post.content.length / 1000).toFixed(0) : 0} mins read
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
            recentPosts.map((recentPost) => <PostCard key={recentPost._id} post={recentPost} />)
          ) : (
            <p className='text-center text-gray-500'>No recent posts available.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default PostPage;

