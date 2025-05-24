'use client';

import { Provider, useSelector } from 'react-redux'
import { RootState, store } from '@/store'

export default function WrapProvider({ children }: { children: React.ReactNode }) {
  
  return (
    <Provider store={store}>
    {children}    
    </Provider>
  )
}
