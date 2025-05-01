import { Route, Routes } from 'react-router-dom'

import { Base } from '~/layouts/Base'
import { About } from '~/pages/About'
import { Home } from '~/pages/Home'
import Reports from '~/pages/Reports/Reports'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Base />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
    </Routes>
  )
}
