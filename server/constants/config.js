export const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:4173', 'https://pneumonia-freelancer.vercel.app']
    ,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}