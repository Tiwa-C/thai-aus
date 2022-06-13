import React from 'react';
import { useState, useEffect,useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Context } from '../../context/Context';
import "./singlePost.css";
import axios from 'axios';

export default function SinglePost() {
  const location = useLocation();
  const path = location.pathname.split('/')[2];
  const [post, setPost] = useState({});
  const PF = 'http://localhost:5000/images/';
  const { user } = useContext(Context);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [updateMode, setUpdateMode] = useState(false);

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get('/posts/' + path);
      setPost(res.data);
      setTitle(res.data.title);
      setDesc(res.data.desc);
    };
   getPost();
  }, [path]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${post._id}`, {
        data: { username: user.username },
      });
      window.location.replace('/');
    } catch (err) {}
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/posts/${post._id}`, {
        username: user.username,
        title,
        desc,
      });
      setUpdateMode(false)
    } catch (err) {}
  };

  return (
    <div className="singlePost">
      <div className="singlePostWrapper">
        {post.photo && (
          <img className="singlePostImg" src={PF + post.photo} alt="" />
        )}
        {updateMode ? (
           <input
           type="text"
           value={title}
           className="singlePostTitleInput"
           autoFocus
           onChange={(e) => setTitle(e.target.value)}
         />
       ) : (
        <h1 className="singlePostTitle">
          {title}
          {user && post.username === user.username && (
          <div className="singlePostEdit">
            <i 
            className="singlePostIcon far fa-edit" 
            onClick={() => setUpdateMode(true)}
            ></i>
            <i 
            className="singlePostIcon far fa-trash-alt" 
            onClick={handleDelete}
            ></i>
          </div>
          )}
        </h1>
        )}
        <div className="singlePostInfo">
          <span className="singlePostAuthor">
            Author:
            <Link to = {`/tags?user=${post.username}`} className='link'>
              <b>{post.username}</b>
            </Link>
          </span>            
          <span className="singlePostcats">
            <Link to = {`/tags?cat=${post.categories}`} className='link'>
              <b>{post.categories}</b> 
            </Link>
          </span>
          <span className="singlePostDate">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        {updateMode ? (
          <textarea
            className="singlePostDescInput"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        ) : ( 
       
        <p className="singlePostDesc">
        {desc}
        </p>
        
        )}
        
        {updateMode && (
          <button className="singlePostButton" onClick={handleUpdate}>
            Update
          </button>
        )} 
      </div>
    </div>
  );
}