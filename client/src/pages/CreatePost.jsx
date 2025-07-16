import { app } from "../firebase.js";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { set } from "mongoose";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {useNavigate} from "react-router-dom";

export default function CreatePost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [file, setFile] = useState(null);
  const [publishError, setPublishError] = useState(null);
  

  const handleUplaodImage = async () => {
  if (!file) {
    setImageUploadError("Please select an image");
    return;
  }

  const imageFile = file.target.files[0];
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch("/api/image/create", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Upload response:", data);
    
    // Use the direct imageUrl - no need for getimage endpoint
    setFormData(prev => ({ ...prev, image: data.imageUrl }));
    
  } catch (error) {
    setImageUploadError("Could not upload image");
    setImageUploadProgress(null);
    console.log(error);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
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
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
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
          />
          <Select 
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
            }}
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
              setFile(e);
            }}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUplaodImage}
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
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
        {publishError && <Alert className="mt-5" color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
}
