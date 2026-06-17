import { useEffect, useState } from 'react';
import { loadConsultationRequests, saveConsultationRequests } from '../data/storage';
import { Bell, CheckCircle, Check, Trash2 } from 'lucide-react';

export default function AdminConsultationRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setRequests(loadConsultationRequests());
  }, []);

  const selectedRequest = requests.find((request) => request.id === selectedId);

  const updateRequests = (nextRequests, message) => {
    setRequests(nextRequests);
    saveConsultationRequests(nextRequests);
    if (message) {
      setSuccess(message);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const toggleRead = (id) => {
    const next = requests.map((request) =>
      request.id === id ? { ...request, isRead: !request.isRead } : request
    );
    updateRequests(next, 'Request marked successfully');
  };

  const deleteRequest = (id) => {
    const next = requests.filter((request) => request.id !== id);
    updateRequests(next, 'Request deleted successfully');
    if (selectedId === id) setSelectedId(null);
  };

  const markAllRead = () => {
    const next = requests.map((request) => ({ ...request, isRead: true }));
    updateRequests(next, 'All requests marked as read');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-navy">Consultation Requests</h2>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Review submitted construction consultation requests and mark them as handled.
          </p>
        </div>
        <button
          onClick={markAllRead}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary-600 px-5 py-3 text-white hover:bg-primary-700"
        >
          <Check className="w-4 h-4" /> Mark all read
        </button>
      </div>

      {success && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" /> {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-navy">Request Queue</h3>
              <p className="text-sm text-gray-500">{requests.length} total requests</p>
            </div>
            <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
              {requests.filter((request) => !request.isRead).length} unread
            </span>
          </div>

          <div className="space-y-3">
            {requests.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
                No consultation requests yet.
              </div>
            )}
            {requests.map((request) => (
              <button
                key={request.id}
                onClick={() => setSelectedId(request.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  selectedId === request.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white hover:border-primary-300'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-navy">{request.name}</p>
                    <p className="text-sm text-gray-500">{request.email} · {request.phone}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${request.isRead ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {request.isRead ? 'Handled' : 'New'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600 truncate">{request.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-soft">
          {selectedRequest ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-navy">Request Details</h3>
                  <p className="text-sm text-gray-500">Submitted on {new Date(selectedRequest.createdAt).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => toggleRead(selectedRequest.id)}
                  className="rounded-2xl bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700"
                >
                  {selectedRequest.isRead ? 'Mark Unread' : 'Mark Read'}
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-sand-50 p-4">
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-navy">{selectedRequest.name}</p>
                </div>
                <div className="rounded-2xl bg-sand-50 p-4">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-navy">{selectedRequest.email}</p>
                </div>
                <div className="rounded-2xl bg-sand-50 p-4">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-navy">{selectedRequest.phone}</p>
                </div>
                <div className="rounded-2xl bg-sand-50 p-4">
                  <p className="text-sm text-gray-500">Request Type</p>
                  <p className="font-medium text-navy">{selectedRequest.type}</p>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-sand-50 p-5">
                <h4 className="text-lg font-semibold text-navy mb-2">Project Details</h4>
                <p className="text-gray-700 whitespace-pre-line">{selectedRequest.description}</p>
              </div>

              <button
                onClick={() => deleteRequest(selectedRequest.id)}
                className="rounded-2xl bg-primary-500 px-5 py-3 text-white hover:bg-primary-600"
              >
                <Trash2 className="inline w-4 h-4 mr-2" /> Delete Request
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
              Select a request to view full details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
