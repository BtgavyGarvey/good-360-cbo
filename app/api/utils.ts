import { NextRequest } from "next/server";
import authOptions from "./auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

const sessionActive = async (req:NextRequest) => {
  const session = await getServerSession(authOptions);
    
  return session;
}

export { sessionActive };