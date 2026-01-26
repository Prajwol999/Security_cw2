import Header from "../components/header"
import Footer from "../components/footer"

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default MainLayout

