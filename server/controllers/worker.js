import { compare } from 'bcrypt';
import { TryCatch } from '../middlewares/error.js';
import { cookieOptions, sendToken, uploadFilesToCloudinary } from '../utils/features.js';
import { ErrorHandler } from '../utils/utility.js';
import { } from '../models/freelancers.js';
import { Profile } from '../models/workerProfile.js';
import { Gig } from '../models/gigs.js';
import { Client } from '../models/clients.js';
import { Order } from '../models/orders.js';
import { Freelancer } from '../models/freelancers.js';


const newWorker = TryCatch(
    async (req, res, next) => {

        const { name, password, email } = req.body;
        const user = await Freelancer.create({
            name,
            password,
            email,
        });
        sendToken(res, user, 201, "User Created", 'worker')
    }
)

const loginWorker = TryCatch(async (req, res, next) => {
    const { password, email } = req.body;
    const user = await Freelancer.findOne({ email }).select("+password");
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
    const userId = req.user._id;
    const role = req.user.role
    if (role == 'client')
        return next(new ErrorHandler('You are not a worker', 404));
    if (!userId) return next(new ErrorHandler('User not found', 404));
    const user = await Freelancer.findOne({ _id: userId })
    return res.status(200).json({
        success: true,
        user,
        role,
    });
})

const createProfile = TryCatch(async (req, res, next) => {
    console.log('create profile')
    const userId = req.user._id;
    console.log(userId)
    const { bio, contact, address, skills, email, name } = req.body;
    //name, email
    const file = req.file
    if (!userId) return next(new ErrorHandler('User not found', 404));
    if (!file)
        return next(new ErrorHandler('Please upload profile Picture', 400))


    const result = await uploadFilesToCloudinary([file])


    const picture = {
        public_id: result[0].public_id,
        url: result[0].url,
    }
    const profile = await Profile.create(
        {
            name,
            picture,
            bio,
            owner: userId,
            email,
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
const getProfile = TryCatch(async (req, res, next) => {


    const userId = req.user._id;

    //name, email
    const workerProfile = await Profile.findOne({ owner: userId });
    if (!workerProfile) return res.status(200).json({
        success: true,
        status: false,
        message: 'profile not found',
    });
    return res.status(200).json({
        success: true,
        workerProfile,
        status: true,
    });
})

const updateProfile = TryCatch(async (req, res, next) => {
    const userId = req.user._id;
    const { bio, contact, address, skills, email, name } = req.body;
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
        const result = await uploadFilesToCloudinary([file])
        profile.picture = {
            public_id: result[0].public_id, // result[0].public_id,
            url: result[0].url,      // result[0].url,
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
    console.log('sevrer req')
    const userId = req.user._id;
    const { title, description, price, deliveryTime, revisions, tags, category, subCategory, faq, isActive } = req.body;
    console.log(req.file)
    const gigImage = req.file || null
    console.log(gigImage)
    if (!gigImage)
        return next(new ErrorHandler("Please Upload Images For Your Gig", 400))
    if (!userId) return next(new ErrorHandler('User not found', 404));
    const result = await uploadFilesToCloudinary([gigImage])
    const myProfile = await Profile.findOne({ owner: userId })
    const attachments = [{
        public_id: result[0].public_id,
        url: result[0].url,
    }];
    console.log(attachments)
    const gig = await Gig.create(
        {
            creator: myProfile._id,
            title,
            description,
            price,
            deliveryTime,
            revisions,
            tags,
            category,
            subCategory,
            faq,
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
    const userId = req.user._id;
    if (!userId) return next(new ErrorHandler('User not found', 404));
    const myProfile = await Profile.findOne({ owner: userId })
    const myGigs = await Gig.find({ creator: myProfile._id }).lean()
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
const getMyGigInfo = TryCatch(async (req, res, next) => {
    const userId = req.user._id;
    const gigId = req.params.id;
    console.log(gigId)

    if (!userId) return next(new ErrorHandler('User not found', 404));

    const myProfile = await Profile.findOne({ owner: userId });
    if (!myProfile) return next(new ErrorHandler("You don't have a worker profile yet", 404));

    const myGig = await Gig.findById(gigId);
    if (!myGig) return next(new ErrorHandler('Gig not found', 404));

    if (myGig.creator.toString() !== myProfile._id.toString()) {
        return next(new ErrorHandler('Unauthorized', 403));
    }

    const { creator, ratings, ...userGig } = myGig.toObject();

    return res.status(200).json({
        success: true,
        userGig,
    });
});


const updateGig = TryCatch(async (req, res, next) => {
    const userId = req.user._id;
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

    const gigImage = req.file || null;
    const gigId = req.params.id;

    const gig = await Gig.findById(gigId);
    const profile = await Profile.findOne({ owner: userId });

    if (!gig) return next(new ErrorHandler("Gig not found", 404));


    if (gig.creator.toString() !== profile._id.toString())
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




    if (gigImage) {
        try {
            gig.gigImages = [];
            const result = await uploadFilesToCloudinary([gigImage])
            const attachments = [{
                public_id: result[0].public_id,
                url: result[0].url,
            }];
            gig.gigImages = attachments;
        } catch (error) {
            return new ErrorHandler("Error uploading image", 500)
        }
        console.log(gig.gigImages)



    }

    await gig.save();

    res.status(200).json({
        success: true,
        message: "Gig updated successfully",
        gig,
    });
});

const answerFaqQuestion = TryCatch(async (req, res, next) => {
    const userId = req.user._id;
    const { faqId, answer } = req.body;
    console.log(faqId)
    const { id: gigId } = req.params;

    if (!faqId || !answer) {
        return next(new ErrorHandler("faqId and answer are required", 400));
    }

    const gig = await Gig.findById(gigId);
    if (!gig) return next(new ErrorHandler("Gig not found", 404));
    const profile = await Profile.findOne({ owner: userId });
    if (!profile) return next(new ErrorHandler("Profile not found", 404));

    if (gig.creator.toString() !== profile._id.toString()) {
        return next(new ErrorHandler("Unauthorized", 403));
    }

    const faqItem = gig.faq.find(f => f._id.toString() === faqId.toString());
    if (!faqItem) return next(new ErrorHandler("FAQ not found", 404));

    faqItem.answer = answer;
    await gig.save();

    res.status(200).json({
        success: true,
        message: 'FAQ answer updated successfully',
        faq: faqItem
    });
});

const deleteGig = TryCatch(async (req, res, next) => {
    const userId = req.user.id;
    const gigId = req.params.id;
    const gig = await Gig.findById(gigId);
    if (!gig) return next(new ErrorHandler("Gig not found", 404));
    if (gig.creator.toString() !== userId)
        return next(new ErrorHandler("Unauthorized", 403));
    await Gig.deleteOne({ _id: gigId })

    res.status(200).json({
        success: true,
        message: "Gig deleted successfully",
    });

})


const getOrders = TryCatch(
    async (req, res, next) => {
        const userId = req.user._id;
        const profile = await Profile.findOne({ owner: userId })
        if (!profile)
            return next(new ErrorHandler("Profile not found", 404));
        const ordersForMe = await Order.find({ freelancer: profile._id }).populate('client', 'name').populate('gig', 'title')

        res.status(200).json({
            success: true,
            ordersForMe,
        })

    }
)
const fetchOrderWithId = TryCatch(
    async (req, res, next) => {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId).populate('client', 'email').populate('gig', 'title')
        if (!order)
            return next(new ErrorHandler("Order not found", 404));
        res.status(200).json({
            success: true,
            order,
        })

    })


const handleOrders = TryCatch(
    async (req, res, next) => {
        const { orderId, status } = req.body;
        console.log(orderId, status)
        const userId = req.user._id;
        const profile = await Profile.findOne({ owner: userId })
        if (!profile)
            return next(new ErrorHandler("Profile not found", 404));
        const order = await Order.findOne({ _id: orderId })
        if (!order)
            return next(new ErrorHandler("Order not found", 404));
        if (order.freelancer.toString() !== profile._id.toString())
            return next(new ErrorHandler("Unauthorized", 403));
        order.status = status;
        await order.save();
        res.status(200).json({
            success: true,
            message: 'order modified succesfully',
            order,
        })

    }
)

const getDeadlines = TryCatch(async (req, res, next) => {
  const freelancerId = req.user._id;
  const profile = await Profile.findOne({ owner: freelancerId });
  const orders = await Order.find({ freelancer: profile._id })
    .populate('gig', 'title deliveryTime')
    .select('orderID createdAt gig');

  const deadlines = orders.map(order => {
    const placedDate = new Date(order.createdAt);
    const deliveryDate = new Date(placedDate);
    deliveryDate.setDate(placedDate.getDate() + order.gig.deliveryTime);

    return {
      id: order._id,
      title: order.gig.title,
      start: placedDate,
      end: deliveryDate,
    };
  });

  res.status(200).json({ success: true, deadlines });
});


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
    handleOrders,
    getOrders,
    getProfile,
    getMyGigInfo,
    answerFaqQuestion,
    fetchOrderWithId,
    getDeadlines,
}