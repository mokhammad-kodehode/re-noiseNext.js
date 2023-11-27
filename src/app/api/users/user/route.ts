import { NextRequest, NextResponse } from "next/server";
import { getDataToken } from "@/app/helpers/getDataToken";
import User from "@/models/userModel";
import {connect} from "@/dbCon/dbConfig"

connect();

export async function GET(request:NextRequest) {
    try {
      const userId = await getDataToken(request)
      const user = await User.findOne({_id: userId}).select("-password");
      return NextResponse.json({
        message: "User found",
        data: user
      })

    } catch (error:any) {
        return NextResponse.json({error:error.message}, {status:400})
    }
}
    
