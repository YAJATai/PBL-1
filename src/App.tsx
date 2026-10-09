import { Route, Routes } from 'react-router-dom'
import { AppShell } from '@/layouts/AppShell'
import { LandingPage } from '@/pages/LandingPage'
import { StudentDashboard } from '@/pages/StudentDashboard'
import { ScanPage } from '@/pages/ScanPage'
import { LeaderboardPage } from '@/pages/LeaderboardPage'
import { MarketPage } from '@/pages/MarketPage'
import { AdminOverview } from '@/pages/AdminOverview'
import { AdminBins } from '@/pages/AdminBins'
import { AdminVehicles } from '@/pages/AdminVehicles'
import { AdminAnalytics } from '@/pages/AdminAnalytics'
import { DriverDashboard } from '@/pages/DriverDashboard'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AppShell />}>
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/scan" element={<ScanPage />} />
        <Route path="/student/leaderboard" element={<LeaderboardPage />} />
        <Route path="/student/market" element={<MarketPage />} />
        <Route path="/admin" element={<AdminOverview />} />
        <Route path="/admin/bins" element={<AdminBins />} />
        <Route path="/admin/vehicles" element={<AdminVehicles />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/driver" element={<DriverDashboard />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
