import { X } from "lucide-react";

function ImageModal({ imgUrl, onClose }) {
    if (!imgUrl) return null;

    return (
        <div className="fixed inset-0 bg-black/60 bg-opacity-70 flex justify-center items-center z-50">
            <div className="relative bg-white rounded-lg p-4 max-w-3xl">
                <button 
                    className="absolute top-2 right-2 bg-gray-800 text-white p-1 rounded-full hover:bg-gray-600"
                    onClick={onClose}
                >
                    <X size={24} />
                </button>
                <img src={imgUrl} alt="Imagen ampliada" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
            </div>
        </div>
    );
}

export default ImageModal;
