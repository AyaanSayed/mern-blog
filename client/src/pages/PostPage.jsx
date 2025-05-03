import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import { Button, Spinner } from 'flowbite-react';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import { use } from 'react';
import PostCard from '../components/PostCard';

export default function PostPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [recentPosts, setRecentPosts] = useState(null);
  const { postSlug } = useParams();
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json()
        if(!res.ok){
          setError(true);
          setLoading(false);
          return;
        }

        if(res.ok){
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }

      } catch (error) {
        setError(true);
        setLoading(false);
      }
    }
    fetchPost()
  }, [postSlug])

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch('/api/post/getposts?limit=3');
        const data = await res.json()
        if(res.ok){
          setRecentPosts(data.posts);
        }
      }

      fetchRecentPosts();
      } catch (error) {
        console.log(error.message);
      }
    }
  ,[])

  if (loading) {
    return <div className='flex justify-center items-center min-h-screen'>
      <Spinner size='xl' />
    </div>
  }
  return (
    <main className='flex flex-col max-w-6xl mx-auto min-h-screen p-3'>
      <h1 className='text-3xl mt-10 text-center mx-auto lg:text-4xl max-w-2xl font-serif p-3 '>
        {post && post.title }
      </h1>
      <Link className='self-center mt-5' to={`/search?category=${post && post.category}`}>
        <Button pill color='gray' size='xs'>
          {post &&  post.category}
        </Button>
      </Link>
      <img src={post && post.image} alt={post && post.title} className='mt-10 p-3 max-h-[600px] w-full object-cover' />

      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>{post && `${(post.content.length/1000).toFixed(0)} min read`}</span>
        
      </div>

      <div className='mx-auto w-full p-3 max-w-2xl post-content' dangerouslySetInnerHTML={{ __html: post && post.content }} >

      </div>
      {/* <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />
      </div> */}

      <div>
        <CommentSection postId={post._id} />
      </div>

      <div className=" flex flex-col items-center justify-center mb-5">
        <h1 className='text-xl mt-5'>Recent articles</h1>
        <div className="flex flex-wrap gap-5 justify-center mt-5">
          {recentPosts && recentPosts.map((post) => (
            <PostCard key={post._id} post={post} />
            ))}
        </div>
      </div>



    </main>
  )
}
