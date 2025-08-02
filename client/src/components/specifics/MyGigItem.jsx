import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar as StarIcon } from 'react-icons/fa';
const MyGigItem = ({ gig }) => {
    useEffect(() => {
        console.log(gig);
    }, [gig]);

    if (!gig) return <div className="text-red-500">No Gig</div>;

    const {
        _id,
        title,
        category,
        subCategory,
        description,
        price,
        deliveryTime,
        revisions,
        tags,
        gigImages,
        isActive,
        createdAt,
        ratings,
    } = gig;

    return (
        <Link
            to={`/gigs/${_id}`} 
            className="cursor-pointer block p-4 w-72 rounded-xl shadow-lg bg-white space-y-3 mx-auto border-1 border-yellow-500"
        >
            <h2 className="text-xl font-bold text-purple-600">{title.trim()}</h2>
            <p className="text-sm text-gray-600">
                <span className="font-semibold">Category:</span> {category.trim()} / {subCategory.trim()}
            </p>
            <img
                src={gigImages?.[0]?.url.length > 0 ?gigImages?.[0]?.url : 'https://cdn.dribbble.com/userupload/16573490/file/original-86360b65d51ebcad69df73818d1f53a9.jpg?resize=400x0'}
                alt="Gig Image"
                className="w-full h-48 object-cover rounded-lg"
            />
            <p className="text-gray-700">{description.trim()}</p>
            <p className="text-sm text-gray-500">Created At: {new Date(createdAt).toLocaleDateString()}</p>
            <p className="text-sm">Price: <span className="font-medium text-green-600">₹{price}</span></p>
            <p className="text-sm">Delivery Time: {deliveryTime} days</p>
            <p className="text-sm">Revisions: {revisions}</p>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                    <span
                        key={i}
                        className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                    >
                        #{tag.trim()}
                    </span>
                ))}
            </div>
            <div className="rating flex items-center gap-1">
                    <StarIcon />
                    {
                        ratings?.count > 0 ?
                        <>
                    <span>{ratings?.average}</span>
                    <span>({ratings?.count})</span>
                    </>:<p>no ratings yet</p>
                    }
                  </div>
            <div className="text-sm mt-2">
                Status:{' '}
                <span className={`font-semibold ${isActive ? 'text-green-500' : 'text-red-500'}`}>
                    {isActive ? 'Active' : 'Inactive'}
                </span>
            </div>
        </Link>
    );
};

export default MyGigItem;
