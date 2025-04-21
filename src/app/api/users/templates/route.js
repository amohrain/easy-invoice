import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getMongoUser } from "../../../../lib/getMongoUser";
import Template from "../../../../models/template.model";

// This route is used to get the user's templates
export async function GET(request) {
  try {
    // authenticate the user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getMongoUser(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // get the user's templates
    const templates = await Template.find({ _id: { $in: user.template } });

    return NextResponse.json(
      { message: "Templates fetched successfully", data: templates },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching templates: ", error);
  }
}

// This route is used to add a template to the user's templates
export async function PUT(request) {
  try {
    // authenticate the user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getMongoUser(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // get the request body
    const { templateId } = await request.json();

    // check if the templateId is already in the user's templates
    if (user.template.includes(templateId)) {
      return NextResponse.json(
        { error: "Template already added" },
        { status: 400 }
      );
    }

    // get users templates
    const templates = await Template.find({ _id: { $in: user.template } });
    const template = await Template.findById(templateId);

    // add the templateId to the user's templates
    user.template = [...templates, template];
    await user.save();

    return NextResponse.json(
      { message: "Template added successfully", data: user.template },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching templates: ", error);
  }
}

// This route is used to remove a template from the user's templates
export async function DELETE(request) {
  try {
    // authenticate the user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getMongoUser(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // get the request body
    const { templateId } = await request.json();

    // get users templates
    const templates = await Template.find({ _id: { $in: user.template } });

    // check if the templateId is in the user's templates
    if (!user.template.includes(templateId)) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 400 }
      );
    }

    // remove the templateId from the user's templates
    user.template = templates.filter(
      (template) => template._id.toString() !== templateId
    );
    await user.save();

    return NextResponse.json(
      { message: "Template removed successfully", data: user.template },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching templates: ", error);
  }
}
