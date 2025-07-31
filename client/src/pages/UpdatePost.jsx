import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {useNavigate, useParams} from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdatePost() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { postId } = useParams();

  useEffect(() => {
    try {
      async function fetchPost() {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if(!res.ok){
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if(res.ok){
          setPublishError(null);
          setFormData(data.posts[0]);
        }
      }
      fetchPost();
    } catch (error) {
      console.log(error);
      
    }
  }, [postId]);

  const [formData, setFormData] = useState({});
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [file, setFile] = useState(null);
  const [publishError, setPublishError] = useState(null);

 
  const handleUploadImage = async () => {
  try {
    if (!file) {
      setImageUploadError("Please select an image");
      return;
    }
    
    setImageUploadError(null);
    setImageUploadProgress(0);
    
    // Create FormData to send the file
    const imageFormData = new FormData();
    imageFormData.append('image', file);

    // Upload to your S3 endpoint
    const response = await fetch("/api/image/create", {
      method: "POST",
      body: imageFormData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Upload response:", data);
    
    // Update the form data with the uploaded image URL
    setFormData(prevFormData => ({ ...prevFormData, image: data.imageUrl }));
    setImageUploadProgress(100);
    
    // Reset progress after a short delay
    setTimeout(() => {
      setImageUploadProgress(null);
    }, 1000);
    
  } catch (error) {
    setImageUploadError(error.message || "Could not upload image");
    setImageUploadProgress(null);
    console.error("Upload error:", error);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/update/${postId}/${currentUser._id}`, { // updated to include userId
        method: "PUT", // changed method to PUT
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data =  await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }

    } catch (error) {
      setPublishError("something went wrong");      
    }

  }

  return (
    <div className="p-2 min-h-screen mx-auto max-w-3xl">
      <h1 className="text-center text-3xl my-7 font-semibold">Update a post</h1>
      <form className=" flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className=" flex flex-col gap-4 sm:flex-row justify-between ">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
            }}
            value={formData.title}
            
          />
          <Select 
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
            }}
            value={formData.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3 ">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            
             {imageUploadProgress
                ? (<div className="w-16 h-16">
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress || 0}%`}
                  />
                </div>)
                : ("Upload Image")}
          </Button>
        </div>
        {imageUploadError &&  (<Alert color="failure">{imageUploadError}</Alert>) }
        {formData.image &&(
          <img src={formData.image} alt="uplaod" className="w-full h-72 object-cover" />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something...."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
          value={formData.content}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update Post
        </Button>
        {publishError && <Alert className="mt-5" color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
}
