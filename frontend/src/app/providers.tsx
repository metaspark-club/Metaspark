'use client'

import { Provider, useDispatch } from 'react-redux'
import { store } from '@/store'
import { setCredentials } from '@/store/authSlice'
import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

type TokenPayload = {
  id: number
  email: string
  username: string
}

function AuthLoader() {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      try {
        const user = jwtDecode<TokenPayload>(token)
        dispatch(setCredentials({ user, token }))
      } catch (err) {
        console.error('Invalid token')
      }
    }
  }, [])

  return null
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthLoader />
      {children}
    </Provider>
  )
}
