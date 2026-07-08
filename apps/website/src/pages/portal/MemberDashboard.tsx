import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useMemberAuth } from '../../context/MemberAuthContext';

export function MemberDashboard() {
  const { token, logout } = useMemberAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/portal/login');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await axios.get('/api/member/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error('Failed to load dashboard', err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          logout();
          navigate('/portal/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token, navigate, logout]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {data.member.firstName}!</h1>
            <p className="text-gray-600">Member ID: {data.member.memberId}</p>
          </div>
          <button 
            onClick={() => { logout(); navigate('/'); }}
            className="px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
            <h3 className="text-gray-500 font-medium mb-2">Available Balance</h3>
            <p className="text-4xl font-bold text-blue-600">GH₵ {data.member.balance.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
            <h3 className="text-gray-500 font-medium mb-2">Active Loans</h3>
            <p className="text-4xl font-bold text-gray-900">{data.loanApplications.filter((l: any) => l.status === 'APPROVED').length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
            <h3 className="text-gray-500 font-medium mb-2">Member Since</h3>
            <p className="text-2xl font-bold text-gray-900">{new Date(data.member.createdAt).getFullYear()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Loan Applications</h2>
            </div>
            <div className="p-6">
              {data.loanApplications.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No loan applications found.</p>
              ) : (
                <div className="space-y-4">
                  {data.loanApplications.map((loan: any) => (
                    <div key={loan.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">GH₵ {loan.amount}</p>
                        <p className="text-sm text-gray-500">{new Date(loan.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        loan.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        loan.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {loan.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Welfare Applications</h2>
            </div>
            <div className="p-6">
              {data.welfareApplications.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No welfare applications found.</p>
              ) : (
                <div className="space-y-4">
                  {data.welfareApplications.map((welfare: any) => (
                    <div key={welfare.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">Welfare Claim</p>
                        <p className="text-sm text-gray-500">{new Date(welfare.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        welfare.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        welfare.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {welfare.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
