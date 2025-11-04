import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await context.params; // ✅ unwrap params
  const filePath = path.join(process.cwd(), "uploads", ...pathSegments);

  if (!fs.existsSync(filePath)) {
    return new NextResponse("File not found", { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const file = fs.createReadStream(filePath);

  return new NextResponse(file as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": stat.size.toString(),
      "Content-Disposition": `inline; filename="${path.basename(filePath)}"`,
    },
  });
}
