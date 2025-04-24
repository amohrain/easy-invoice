// pages/api/clients/top-five.js
import { auth } from "@clerk/nextjs/server";
import connectDB from "../../../../lib/mongodb";
import mongoose from "mongoose";
import { ObjectId } from "mongoose";
import Invoice from "../../../../models/invoice.model";
import { NextResponse } from "next/server";
import { getMongoUser } from "../../../../lib/getMongoUser";

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }
    const user = await getMongoUser(userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    await connectDB();

    // Aggregation pipeline to get top 5 clients by invoice amount

    const topClients = await Invoice.aggregate([
      // Match invoices for the current user and company
      {
        $match: {
          user: new mongoose.Types.ObjectId(user._id),
          company: new mongoose.Types.ObjectId(user.company),
        },
      },
      // Group by clientId and sum the totalAmount
      {
        $group: {
          _id: "$clientId",
          totalBilled: { $sum: "$totalAmount" },
          invoiceCount: { $sum: 1 },
          lastInvoiceDate: { $max: "$createdAt" },
        },
      },
      // Sort by total amount in descending order
      {
        $sort: {
          totalBilled: -1,
        },
      },
      // Limit to top 5 results
      {
        $limit: 5,
      },
      // Lookup to get client details
      {
        $lookup: {
          from: "clients",
          localField: "_id",
          foreignField: "_id",
          as: "clientDetails",
        },
      },
      // Unwind the clientDetails array
      {
        $unwind: "$clientDetails",
      },
      // Project only the fields we need
      {
        $project: {
          _id: 1,
          clientName: "$clientDetails.clientName",
          clientEmail: "$clientDetails.clientEmail",
          clientPhone: "$clientDetails.clientPhone",
          status: "$clientDetails.status",
          totalBilled: 1,
          invoiceCount: 1,
          lastInvoiceDate: 1,
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: topClients,
    });
  } catch (error) {
    console.error("Error fetching top clients:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
