// app/api/invoices/daily-revenue/route.js
import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import Invoice from "../../../../models/invoice.model";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";
import { getMongoUser } from "../../../../lib/getMongoUser";

export async function GET(request) {
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

    const { searchParams } = new URL(request.url);
    const month = parseInt(
      searchParams.get("month") || new Date().getMonth() + 1
    );
    const year = parseInt(searchParams.get("year") || new Date().getFullYear());

    await connectDB();

    // Validate the IDs are valid MongoDB ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(user._id) ||
      !mongoose.Types.ObjectId.isValid(user.company)
    ) {
      return NextResponse.json(
        { message: "Invalid User ID or Company ID format" },
        { status: 400 }
      );
    }

    // Calculate start and end dates for the specified month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month

    // Aggregation pipeline to get daily revenue
    const dailyRevenue = await Invoice.aggregate([
      // Match invoices for the current user, company and date range
      {
        $match: {
          user: new mongoose.Types.ObjectId(user._id),
          company: new mongoose.Types.ObjectId(user.company),
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      // Add a field to extract just the date part (without time)
      {
        $addFields: {
          dateOnly: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
        },
      },
      // Group by date and sum the totalAmount
      {
        $group: {
          _id: "$dateOnly",
          amount: { $sum: "$totalAmount" },
        },
      },
      // Sort by date
      {
        $sort: {
          _id: 1,
        },
      },
      // Reshape for easier consumption
      {
        $project: {
          _id: 0,
          date: "$_id",
          amount: 1,
        },
      },
    ]);

    // Fill in dates with no invoices (set to 0)
    const allDates = [];
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
      const existingData = dailyRevenue.find(
        (item) => item.date === dateString
      );

      allDates.push({
        date: dateString,
        amount: existingData ? existingData.amount : 0,
      });
    }

    return NextResponse.json({ success: true, data: allDates });
  } catch (error) {
    console.error("Error fetching daily revenue:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
