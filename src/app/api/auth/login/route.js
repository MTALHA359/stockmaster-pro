// import { connectDB } from "@/lib/db";
// import User from "@/app/models/User";
// export async function POST(req) {
//   await connectDB();

//   const { email, password, role } = await req.json();

//   if (!email || !password || !role) {
//     return new Response(
//       JSON.stringify({ error: "Email, password, and role are required." }),
//       { status: 400 }
//     );
//   }

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return new Response(JSON.stringify({ error: "Invalid credentials." }), {
//         status: 401,
//       });
//     }

//     if (user.status !== "active") {
//       return new Response(JSON.stringify({ error: "User is inactive." }), {
//         status: 403,
//       });
//     }

//     if (user.role !== role) {
//       return new Response(
//         JSON.stringify({ error: "User role does not match selected role." }),
//         { status: 403 }
//       );
//     }

//     const isMatch = await user.comparePassword(password);

//     if (!isMatch) {
//       return new Response(JSON.stringify({ error: "Invalid credentials." }), {
//         status: 401,
//       });
//     }

//     // TODO: Create session or JWT token here for authentication (example below is minimal)
//     const userObj = user.toObject();
//     delete userObj.password;

//     return new Response(
//       JSON.stringify({ user: userObj, message: "Login successful" }),
//       { status: 200 }
//     );
//   } catch (error) {
//     return new Response(
//       JSON.stringify({ error: "Server error during login." }),
//       { status: 500 }
//     );
//   }
// }

import User from "@/app/models/User";
import bcrypt from "bcrypt";
import connectDB from "@/lib/dbConnect";
export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    const user = await User.findOne({ email });

    if (!user) {
      return new Response("User not found", { status: 401 });
    }

    if (!user.active) {
      return new Response("User inactive", { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return new Response("Invalid credentials", { status: 401 });
    }

    // Here you can create session / JWT token, etc.
    return new Response("Login successful", { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return new Response("Server error", { status: 500 });
  }
}
