import GigItem from './GigItem'

const GigList = ({
    gigs = []
}) => {
  
  return (
    <div className="h-[100%] w-[100%] flex flex-wrap gap-10 p-10 overflow-auto">

    {
        gigs.map((i)=>(
            <GigItem gig={i} key={i._id}/>
        ))
    }
    </div>
  )
}

export default GigList