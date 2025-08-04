import { FaStar } from 'react-icons/fa'
import { Link } from 'react-router-dom'
const GigItem = ({
  gig,
}) => {

  return (
    <Link
      className='h-100 w-85 p-4 shadow-2xl rounded-2xl'
      to={`/gig/${gig._id}`}
    >
      <div className="rounded-l-4xl h-48 overflow-clip">
        <img
          className='w-[100%] rounded-2xl'
          src={gig?.gigImages[0]?.url || 'https://cdn.dribbble.com/userupload/16573490/file/original-86360b65d51ebcad69df73818d1f53a9.jpg?resize=400x0'} alt="" />
      </div>
      <div
        className='flex p-3 items-center gap-4 '
      >
        <img
          className='pfp'
          src={gig?.creator?.picture?.url || 'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_original/v1/attachments/profile/photo/386c0b8f584977db82c71e4f78c778c2-1677686441502/27560ea0-c990-4abf-8964-2ca1a34db2fd.png'} alt="" />
        <span>{gig?.creator?.name || 'Gig Creator'}</span>
      </div>
      <span>{gig?.title}</span>
      <div className="rating flex items-center gap-1">
        <FaStar />
        <span>{gig?.ratings?.average}</span>
        <span>({gig?.ratings?.count})</span>
      </div>
      <span className="price">{gig?.price} Rs</span>

    </Link>
  )
}

export default GigItem