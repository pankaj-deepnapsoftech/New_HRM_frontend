import React, { useMemo } from "react";
import { useGetPendingLeaveRequestsQuery, useUpdateRequestStatusMutation } from "@/store/api/api";
import { toast } from "react-toastify";

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return "-";
  }
};

const HRDashboard = () => {
  const { data, isLoading, isError, refetch } = useGetPendingLeaveRequestsQuery();
  const [updateRequestStatus, { isLoading: isUpdating }] = useUpdateRequestStatusMutation();

  const requests = useMemo(() => data?.data || [], [data]);

  const handleAction = async (id, action) => {
    try {
      await updateRequestStatus({ id, status: action }).unwrap();
      toast.success(`Request ${action} successfully`);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || `Failed to ${action} request`);
    }
  };

  if (isLoading) return <div className="p-4">Loading pending requests...</div>;
  if (isError) return <div className="p-4 text-red-600">Failed to load requests.</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">HR Dashboard - Pending Leave Requests</h2>
      {requests.length === 0 ? (
        <div className="text-gray-600">No pending requests.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left border">Employee</th>
                <th className="px-4 py-2 text-left border">Type</th>
                <th className="px-4 py-2 text-left border">Mode</th>
                <th className="px-4 py-2 text-left border">From</th>
                <th className="px-4 py-2 text-left border">To</th>
                <th className="px-4 py-2 text-left border">Status</th>
                <th className="px-4 py-2 text-left border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id} className="border-t">
                  <td className="px-4 py-2 border">{req.employeeId}</td>
                  <td className="px-4 py-2 border capitalize">{req.type}</td>
                  <td className="px-4 py-2 border capitalize">{req.mode}</td>
                  <td className="px-4 py-2 border">{formatDate(req.from)}</td>
                  <td className="px-4 py-2 border">{formatDate(req.to)}</td>
                  <td className="px-4 py-2 border capitalize">{req.status}</td>
                  <td className="px-4 py-2 border">
                    <div className="flex gap-2">
                      <button
                        disabled={isUpdating}
                        onClick={() => handleAction(req._id, "approved")}
                        className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-60"
                      >
                        Approve
                      </button>
                      <button
                        disabled={isUpdating}
                        onClick={() => handleAction(req._id, "rejected")}
                        className="px-3 py-1 rounded bg-red-600 text-white disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HRDashboard;


