import React, { createContext, useContext, useState, useEffect } from 'react';

interface Member {
  id: number;
  memberId: string;
  firstName: string;
  lastName: string;
  balance: number;
}

interface MemberAuthContextType {
  member: Member | null;
  token: string | null;
  login: (token: string, member: Member) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const MemberAuthContext = createContext<MemberAuthContextType>({
  member: null,
  token: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const MemberAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [member, setMember] = useState<Member | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('memberToken');
    const storedMember = localStorage.getItem('memberData');

    if (storedToken && storedMember) {
      setToken(storedToken);
      setMember(JSON.parse(storedMember));
    }
  }, []);

  const login = (newToken: string, newMember: Member) => {
    localStorage.setItem('memberToken', newToken);
    localStorage.setItem('memberData', JSON.stringify(newMember));
    setToken(newToken);
    setMember(newMember);
  };

  const logout = () => {
    localStorage.removeItem('memberToken');
    localStorage.removeItem('memberData');
    setToken(null);
    setMember(null);
  };

  return (
    <MemberAuthContext.Provider value={{ member, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </MemberAuthContext.Provider>
  );
};

export const useMemberAuth = () => useContext(MemberAuthContext);
