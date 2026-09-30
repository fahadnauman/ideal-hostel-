import { getTenantById } from "@/lib/tenants-store";
import { notFound } from "next/navigation";

export default async function PrintApplicationPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const tenant = getTenantById(tenantId);
  
  if (!tenant) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-12 bg-white text-black min-h-screen">
      {/* Print Trigger */}
      <script dangerouslySetInnerHTML={{ __html: `window.onload = function() { window.print(); }` }} />

      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-black pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Ideal Hostel</h1>
          <p className="text-sm text-gray-600 mt-1 font-medium">Tenant Registration Application</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">Application ID: {tenant.id}</p>
          <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString('en-IN')}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Personal Details */}
        <section>
          <h2 className="text-xl font-bold bg-gray-100 p-2 mb-4 border-l-4 border-black">1. Personal Information</h2>
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 px-2">
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Full Name</span>
              <p className="text-lg font-semibold">{tenant.name}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Phone Number</span>
              <p className="text-lg font-semibold">{tenant.phone}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Email Address</span>
              <p className="text-lg font-semibold">{tenant.email || "N/A"}</p>
            </div>
          </div>
        </section>

        {/* Accommodation Details */}
        <section>
          <h2 className="text-xl font-bold bg-gray-100 p-2 mb-4 border-l-4 border-black">2. Accommodation Details</h2>
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 px-2">
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Room & Bed</span>
              <p className="text-lg font-semibold">Room {tenant.roomNumber} - Bed {tenant.bedNumber}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Check-in Date</span>
              <p className="text-lg font-semibold">{new Date(tenant.checkInDate).toLocaleDateString('en-IN')}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Monthly Rent</span>
              <p className="text-lg font-semibold">₹{tenant.monthlyRent.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Security Deposit</span>
              <p className="text-lg font-semibold">₹{tenant.advanceDeposit.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section>
          <h2 className="text-xl font-bold bg-gray-100 p-2 mb-4 border-l-4 border-black">3. Emergency Contact</h2>
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 px-2">
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Contact Name</span>
              <p className="text-lg font-semibold">{tenant.emergencyContactName || "Not Provided"}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Phone Number</span>
              <p className="text-lg font-semibold">{tenant.emergencyContactPhone || "Not Provided"}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Relationship</span>
              <p className="text-lg font-semibold">{tenant.emergencyContactRelation || "Not Provided"}</p>
            </div>
          </div>
        </section>

        {/* Terms and Conditions */}
        <section>
          <h2 className="text-xl font-bold bg-gray-100 p-2 mb-4 border-l-4 border-black">4. Terms & Conditions</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 px-2">
            <li>Rent must be paid on or before the {tenant.rentDueDate}th of every month.</li>
            <li>Security deposit is strictly non-adjustable against rent.</li>
            <li>A minimum of 30 days notice is required before vacating the premises.</li>
            <li>Any damage to property will be deducted from the security deposit.</li>
          </ul>
        </section>

        {/* Signatures */}
        <section className="pt-20 mt-12 flex justify-between px-8">
          <div className="text-center">
            <div className="w-48 border-b border-black mb-2"></div>
            <span className="text-sm font-bold uppercase tracking-wider">Tenant Signature</span>
          </div>
          <div className="text-center">
            <div className="w-48 border-b border-black mb-2"></div>
            <span className="text-sm font-bold uppercase tracking-wider">Management Signature</span>
          </div>
        </section>
      </div>
    </div>
  );
}
