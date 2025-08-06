import React, { useState } from 'react'
import { useAppDispatch } from '../hooks/redux'
import { setCredentials } from '../store/slices/authSlice'
import { Shield, Mail, ArrowRight, Sparkles } from 'lucide-react'

export default function SimpleLogin() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()

  const handleLogin = async () => {
    if (!email.trim()) return
    
    setIsLoading(true)
    console.log('🔑 Attempting login with email:', email);
    
    // 실제 로그인 과정을 시뮬레이션하기 위한 지연
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockUser = {
      id: '1',
      name: email.split('@')[0] || 'user',
      email: email,
      role: 'Security Analyst' as const,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    }
    
    const mockTokens = {
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24시간 후
    }
    
    try {
      console.log('📦 Dispatching setCredentials...');
      console.log('👤 Mock user data:', mockUser);
      console.log('🎫 Mock tokens:', mockTokens);
      
      dispatch(setCredentials({
        user: mockUser,
        tokens: mockTokens
      }));
      
      console.log('✅ Credentials dispatched successfully');
      
    } catch (error) {
      console.error('💥 Login error:', error);
      alert('로그인 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin()
    }
  }

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail)
    setTimeout(() => handleLogin(), 100)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Main Login Card */}
        <div className="cyber-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative mx-auto w-16 h-16 mb-6">
              <Shield className="w-16 h-16 text-primary mx-auto" />
              <div className="absolute inset-0 w-16 h-16 text-primary animate-pulse opacity-30 mx-auto">
                <Shield className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-glow bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent mb-2">
              NcuScript Automator
            </h1>
            <p className="text-muted-foreground">
              보안 검증 자동화 플랫폼에 접속하세요
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                이메일 주소
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-foreground placeholder-muted-foreground"
                />
              </div>
            </div>

            <button 
              onClick={handleLogin} 
              disabled={!email.trim() || isLoading}
              className="w-full cyber-button py-3 px-4 font-medium flex items-center justify-center gap-2 transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                  <span>접속 중...</span>
                </>
              ) : (
                <>
                  <span>보안 플랫폼 접속</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>

          {/* Demo Section */}
          <div className="mt-8 pt-6 border-t border-border/50">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>데모 계정으로 빠른 체험</span>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => handleQuickLogin('admin@ncusecurity.co.kr')}
                  disabled={isLoading}
                  className="text-sm px-4 py-2 bg-card/50 hover:bg-primary/10 border border-border/50 hover:border-primary/30 rounded-md transition-all duration-200 text-muted-foreground hover:text-primary"
                >
                  🔐 보안 관리자로 로그인
                </button>
                <button
                  onClick={() => handleQuickLogin('analyst@ncusecurity.co.kr')}
                  disabled={isLoading}
                  className="text-sm px-4 py-2 bg-card/50 hover:bg-primary/10 border border-border/50 hover:border-primary/30 rounded-md transition-all duration-200 text-muted-foreground hover:text-primary"
                >
                  📊 보안 분석가로 로그인
                </button>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                💡 아무 이메일 주소나 입력하여 데모를 체험할 수 있습니다
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            보안 준수 검사 자동화 • v1.0.0
          </p>
        </div>
      </div>
    </div>
  )
}