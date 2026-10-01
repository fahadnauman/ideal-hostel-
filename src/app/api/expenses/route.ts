import { NextRequest, NextResponse } from "next/server";
import { getAllExpenses, addExpense } from "@/lib/expenses-store";

export async function GET(request: NextRequest) {
  try {
    const expenses = getAllExpenses();
    return NextResponse.json({ success: true, data: expenses });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch expenses" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.category || !body.amount || !body.status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const newExpense = addExpense({
      category: body.category,
      amount: Number(body.amount),
      date: body.date || new Date().toISOString(),
      status: body.status,
    });
    
    return NextResponse.json({ success: true, data: newExpense });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
