import React from "react"
import { useState, useEffect } from "react"
import { Upload, Eye } from "lucide-react"
import axios from 'axios';
import { useNavigate } from "react-router-dom";


function CreatePost({ theme }) {
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [img_url, setimg_url] = useState("")
    const [showPreview, setShowPreview] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://localhost:1234/api/user/me", { withCredentials: true })
            .then((response) => {
                console.log(response.data);
                setUser(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener usuario", error);
            });
    }, []);
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const user_id = user.id;
            console.log(user_id);
            const response = await axios.post(
                "http://localhost:1234/api/posts/createPost",
                {user_id, title, content, img_url },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );
            console.log({ user_id, title, content, img_url })

            navigate("/home")
        } catch (error) {
            alert("An unexpected error occurred");
        }

    }

    const handlePreview = () => {
        if (showPreview) {
            setShowPreview(false)

        } else {
            setShowPreview(true)

        }
    }

    return (
        <div className={`min-h-screen p-5 md:ml-64 md:p-10 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}` }>
    <div className="max-w-2xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Create New Post
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="title" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Title
                </label>
                <input
                    id="title"
                    type="text"
                    placeholder="Enter post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="content" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Content
                </label>
                <textarea
                    id="content"
                    placeholder="Write your post content here"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px] 
                        ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="img_url" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Image URL
                </label>
                <div className="flex space-x-2">
                    <input
                        id="img_url"
                        type="url"
                        placeholder="Enter image URL"
                        value={img_url}
                        onChange={(e) => setimg_url(e.target.value)}
                        className={`flex-grow px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                            ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                    />
                    <button
                        type="button"
                        onClick={handlePreview}
                        className={`px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 
                            ${theme === 'dark' ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-200 text-gray-700'}`}
                    >
                        <Eye className="h-5 w-5" />
                        <span className="sr-only">Preview image</span>
                    </button>
                </div>
            </div>
            {showPreview && img_url && (
                <div className="mt-4">
                    <img
                        src={img_url || "/placeholder.svg"}
                        alt="Post preview"
                        className="max-w-full h-auto rounded-lg shadow-md"
                        onError={() => setShowPreview(false)}
                    />
                </div>
            )}
            <button
                type="submit"
                className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                    ${theme === 'dark' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                <Upload className="h-5 w-5 mr-2" />
                Create Post
            </button>
        </form>
    </div>
</div>

    )
}

export default CreatePost