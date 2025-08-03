import { userSocketIDs } from "../app.js";
export const getBase64 = (file) => `data:${file.mimetype};base64,${file.buffer.toString(`base64`)}`;
// export const getSockets = (users =[])=>{
//     return users.map(user=>userSocketIDs.get(user.toString()))
// }