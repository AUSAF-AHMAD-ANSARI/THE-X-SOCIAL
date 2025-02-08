import React, { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from './ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from './ui/dialog';
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Button } from './ui/button';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import CommentDialog from './CommentDialog';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Badge } from './ui/badge';

const Post = ({ post }) => {
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setText(e.target.value.trim() || '');
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? 'dislike' : 'like';
      const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/${action}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));

        toast.success(res.data.message);
        setText('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post?._id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id);
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to delete post');
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/post/${post?._id}/bookmark`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="my-6 w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.author?.profilePicture} alt="profile" />
            <AvatarFallback className="bg-gray-200">CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm">{post.author?.username}</h1>
            {user?._id === post.author._id && (
              <Badge variant="secondary" className="text-xs">
                Author
              </Badge>
            )}
          </div>
        </div>

        {/* More Options */}
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="w-5 h-5 cursor-pointer text-gray-600 hover:text-gray-800" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {post?.author?._id !== user?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold"
              >
                Unfollow
              </Button>
            )}
            <Button
              variant="ghost"
              className="cursor-pointer w-fit hover:text-gray-800"
            >
              Add to favorites
            </Button>
            {user && user?._id === post?.author._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="cursor-pointer w-fit hover:text-red-600"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Image */}
      <img
        className="w-full aspect-square object-cover"
        src={post.image}
        alt="post_img"
      />

      {/* Actions */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {liked ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              size={24}
              className="cursor-pointer text-red-500 hover:text-red-600 transition-colors"
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              size={22}
              className="cursor-pointer text-gray-600 hover:text-red-500 transition-colors"
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="w-6 h-6 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
          />
          <Send className="w-6 h-6 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors" />
        </div>
        <Bookmark
          onClick={bookmarkHandler}
          className="w-6 h-6 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
        />
      </div>

      {/* Likes and Caption */}
      <div className="px-4 pb-3">
        <span className="font-semibold text-sm block mb-1">{postLike} likes</span>
        <p className="text-sm">
          <span className="font-medium mr-1">{post.author?.username}</span>
          {post.caption}
        </p>
        {comment.length > 0 && (
          <span
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="block mt-2 text-xs text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
          >
            View all {comment.length} comments
          </span>
        )}
      </div>

      {/* Add Comment */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="Add a comment..."
            value={text}
            onChange={changeEventHandler}
            className="outline-none text-sm w-full placeholder:text-gray-400"
          />
          {text && (
            <span
              onClick={commentHandler}
              className="text-[#3BADF8] text-sm font-medium cursor-pointer hover:text-[#2A9DF4] transition-colors"
            >
              Post
            </span>
          )}
        </div>
      </div>

      {/* Comment Dialog */}
      <CommentDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Post;