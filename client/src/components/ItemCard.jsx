import { useNavigate } from 'react-router-dom';

const ItemCard = ({ item }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/item/${item._id}`);
    };
    return (
        <div
            onClick={handleClick}
            className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200">
                {item.images && item.images.length > 0 ? (
                    <img
                        src={item?.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-green-600 font-bold mb-2">${item.price}</p>
                <p className="text-gray-600 text-sm mb-2">{item.condition}</p>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{item.category}</span>
                    <span className="text-sm text-gray-500">
                        Posted by {item.seller.username}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ItemCard;