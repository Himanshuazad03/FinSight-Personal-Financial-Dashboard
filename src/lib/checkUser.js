import User from "@/models/User";
import { connectDB } from "@/dbConfig/db";
import { currentUser } from "@clerk/nextjs/server";

export const checkUser = async ()=>{
    const user = await currentUser();

    if(!user) return null;

    try {
        await connectDB();
        const loggedInUser = await User.findOne({clerkUserId:user.id});

        if(loggedInUser) return loggedInUser;

        const newUser = await User.create({
            clerkUserId:user.id,
            email:user.emailAddresses[0].emailAddress,
            name:user.fullName,
            imageUrl:user.imageUrl
        });

        return newUser;
    } catch (error) {
        console.log(error.message)
    }
}