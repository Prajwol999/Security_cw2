import MainLayout from "../layouts/MainLayout"
import HeroSection from "../components/hero"
import ServicesSection from "../components/services"
import HelpNeededSection from "../components/help-needed"
import StatsSection from "../components/stats"


const Homepage = () => {
  return (
    <MainLayout>
      <HeroSection />
      <ServicesSection />
      <HelpNeededSection />
      <StatsSection />
    </MainLayout>
  )
}

export default Homepage


