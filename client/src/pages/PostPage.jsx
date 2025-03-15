// PostPage.jsx

import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

const PostPage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/post/getposts?slug=${postSlug}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();

        if (!data?.posts?.length) {
          throw new Error('Post data invalid');
        }

        setPost(data.posts[0]);
      } catch (err) {
        setError(err.message || 'Failed to fetch post');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/post/getposts?limit=3`);
        if (!res.ok) {
          throw new Error('Failed to fetch recent posts');
        }
        const data = await res.json();
        if (data?.posts) {
          setRecentPosts(data.posts);
        } else {
          console.error('Recent posts data invalid');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch recent posts');
        console.error('Error fetching recent posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentPosts();
  }, []);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
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
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post?.content || '' }}
      ></div>
      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />
      </div>
      {post?._id && <CommentSection postId={post._id} />}

      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Recent articles</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentPosts?.map((recentPost) => <PostCard key={recentPost._id} post={recentPost} />)}
        </div>
      </div>
    </main>
  );
};

export default PostPage;