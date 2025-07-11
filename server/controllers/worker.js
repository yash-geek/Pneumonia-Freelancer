import { compare } from 'bcrypt';
import { TryCatch } from '../middlewares/error.js';
import { cookieOptions, sendToken } from '../utils/features.js';
import { ErrorHandler } from '../utils/utility.js';
import { FreeLancer } from '../models/freelancers.js';
import { Profile } from '../models/workerProfile.js';
import { Gig } from '../models/gigs.js';
import { Client } from '../models/clients.js';


const newWorker = TryCatch(
    async (req, res, next) => {

        const { name, password, email } = req.body;
        const user = await FreeLancer.create({
            name,
            password,
            email,
        });
        sendToken(res, user, 201, "User Created", 'worker')
    }
)

const loginWorker = TryCatch(async (req, res, next) => {
    const { password, email } = req.body;
    const user = await FreeLancer.findOne({ email }).select("+password");
    if (!user) return next(new ErrorHandler('User not found', 404));
    const isMatch = await compare(password, user.password);
    if (!isMatch) return next(new ErrorHandler('Invalid Username or Password', 404));
    sendToken(res, user, 200, `Welcome back, ${user.name}`, 'worker');
});
const logoutWorker = TryCatch(async (req, res) => {
    return res.status(200).cookie("pneumonia-worker-token", "", {
        ...cookieOptions,
        maxAge: 0,
    }).json({
        success: true,
        message: "Logged out successfully",
    });
})

const getWorker = TryCatch(async (req, res, next) => {
    const userId = req.user.id;
    const role = req.user.role
    if (role == 'client')
        return next(new ErrorHandler('You are not a worker', 404));
    if (!userId) return next(new ErrorHandler('User not found', 404));
    const user = await FreeLancer.findOne({ _id: userId })
    return res.status(200).json({
        success: true,
        user,
        role,
    });
})

const createProfile = TryCatch(async (req, res, next) => {
    const userId = req.user.id;
    const { bio, contact, address, skills } = req.body;
    //name, email
    const user = await FreeLancer.findOne({ _id: userId });
    if (!user) return next(new ErrorHandler('User not found', 404));
    const file = req.file
    if (!userId) return next(new ErrorHandler('User not found', 404));
    if (!file)
        return next(new ErrorHandler('Please upload profile Picture', 400))
    //const result = await uploadFilesToCloudinary([file])
    const picture = {
        public_id: 'public_id',  //result[0].public_id,
        url: 'picture url' //result[0].url,
    }
    const profile = await Profile.create(
        {
            name: user.name,
            picture,
            bio,
            owner: userId,
            email: user.email,
            contact,
            address,
            skills,
        }
    )
    return res.status(200).json({
        success: true,
        profile,
    });
})
const updateProfile = TryCatch(async (req, res, next) => {
    const userId = req.user.id;
    const { name, bio, email, contact, address, skills } = req.body;
    const file = req.file;

    const profile = await Profile.findOne({ owner: userId });
    if (!profile) return next(new ErrorHandler("Profile not found", 404));

    // Optional field checks
    if (name) profile.name = name;
    if (bio) profile.bio = bio;
    if (email) profile.email = email;
    if (contact) profile.contact = contact;
    if (address) profile.address = address;

    // Handle skills (single or multiple)
    if (skills) {
        if (Array.isArray(skills)) {
            profile.skills = skills;
        } else {
            profile.skills = [skills]; // single skill
        }
    }


    if (file) {
        // const result = await uploadFilesToCloudinary([file]); // if using cloud
        profile.picture = {
            public_id: 'updated_id', // result[0].public_id,
            url: 'updated url',      // result[0].url,
        };
    }

    await profile.save();

    res.status(200).json({
        success: true,
        message: "Profile updated successfully ",
        profile,
    });
});

const createGig = TryCatch(async (req, res, next) => {
    const userId = req.user.id;
    const { title, description, price, deliveryTime, revisions, tags, category, subCategory, faq, ratings, isActive } = req.body;
    const gigImages = req.files || []
    if (gigImages.length < 1)
        return next(new ErrorHandler("Please Upload Images For Your Gig", 400))
    if (gigImages.length > 5)
        return next(new ErrorHandler("Max 5 files Images are allowed", 400))
    if (!userId) return next(new ErrorHandler('User not found', 404));
    //const attachments = await uploadFilesToCloudinary(gigImages)
    const attachments = gigImages.map((file) => {
        return {
            public_id: 'public_id', //file.public_id,
            url: 'url', //file.url,
        };
    });
    const gig = await Gig.create(
        {
            creator: userId,
            title,
            description,
            price,
            deliveryTime,
            revisions,
            tags,
            category,
            subCategory,
            faq,
            ratings,
            isActive,
            gigImages: attachments,
        }
    )
    return res.status(200).json({
        success: true,
        gig,
    });
})

const getMyGigs = TryCatch(async (req, res, next) => {
    const userId = req.user.id;
    if (!userId) return next(new ErrorHandler('User not found', 404));
    const myGigs = await Gig.find({ creator: userId }).lean()
    const userGigs = myGigs.map(
        (
            {
                ratings, creator, ...rest
            }
        ) => (rest))
    return res.status(200).json({
        success: true,
        userGigs,
    });
})
const updateGig = TryCatch(async (req, res, next) => {
    const userId = req.user.id;
    const {
        title,
        description,
        price,
        deliveryTime,
        revisions,
        tags,
        category,
        subCategory,
        faq,
        isActive
    } = req.body;

    const gigImages = req.files || [];
    const gigId = req.params.id;

    const gig = await Gig.findById(gigId);

    if (!gig) return next(new ErrorHandler("Gig not found", 404));


    if (gig.creator.toString() !== userId)
        return next(new ErrorHandler("Unauthorized", 403));

    if (title) gig.title = title;
    if (description) gig.description = description;
    if (price) gig.price = price;
    if (deliveryTime) gig.deliveryTime = deliveryTime;
    if (revisions) gig.revisions = revisions;
    if (tags) gig.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
    if (category) gig.category = category;
    if (subCategory) gig.subCategory = subCategory;
    if (faq) gig.faq = Array.isArray(faq) ? faq : []; // depends on how you're sending
    if (isActive !== undefined) gig.isActive = isActive;




    if (gigImages.length > 0) {
        gig.gigImages = [];
        for (const file of gigImages) {
            //   const result = await cloudinary.uploader.upload(file.path, {
            //     folder: "gigs",
            //   });
            const result = {
                public_id: 'updated_id', // result[0].public_id,
                url: 'updated url',      // result[0].url,
            }



            gig.gigImages.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }
    }

    await gig.save();

    res.status(200).json({
        success: true,
        message: "Gig updated successfully",
        gig,
    });
});


const deleteGig = TryCatch(async (req, res, next) => {
    const userId = req.user.id; 
    const gigId = req.params.id;
    const gig = await Gig.findById(gigId);
    if (!gig) return next(new ErrorHandler("Gig not found", 404));
    if (gig.creator.toString() !== userId)
        return next(new ErrorHandler("Unauthorized", 403));
    await Gig.deleteOne({_id:gigId})

    res.status(200).json({
        success: true,
        message: "Gig deleted successfully",
    });

})



export {
    logoutWorker,
    newWorker,
    loginWorker,
    getWorker,
    createProfile,
    updateProfile,
    createGig,
    getMyGigs,
    updateGig,
    deleteGig,
}