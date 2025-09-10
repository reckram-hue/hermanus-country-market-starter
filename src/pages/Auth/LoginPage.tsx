import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/ui/Button'

const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')

  const handleLogin = async (value?: string) => {
    try {
      await login(value ?? email)
    } catch (e:any) {
      alert(e.message || 'Login failed')
    }
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div className="bg-white rounded-xl shadow p-8 w-[420px]">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Sign in</h2>
        <p className="text-sm text-slate-600 mb-4">Use one of the demo accounts or your email if seeded.</p>

        <div className="space-y-2 mb-6">
          <Button className="w-full" onClick={() => handleLogin('admin@market.com')}>Sign in as Admin</Button>
          <Button className="w-full" variant="secondary" onClick={() => handleLogin('trader1@market.com')}>Sign in as Trader</Button>
          <Button className="w-full" variant="ghost" onClick={() => handleLogin('applicant@market.com')}>Sign in as Applicant</Button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@market.com"
          />
          <Button className="w-full mt-2" onClick={() => handleLogin()}>Sign in</Button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
