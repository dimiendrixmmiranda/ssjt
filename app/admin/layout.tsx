import Footer from "@/components/assets/footer/Footer"
import Sidebar from "@/components/sidebar/Sidebar"
import { menusDashboardAdmin } from "@/lib/menusDashboardAdmin"

interface LayoutProps{
    children: React.ReactNode
}

export default function Layout({children}:LayoutProps){
    return(
        <div className="grid grid-cols-[300px_1fr] grid-rows-[1fr_80px] w-full min-h-screen">
            <Sidebar menuDashboard={menusDashboardAdmin}/>
            <div className="max-h-[90vh] overflow-y-scroll">{children}</div>
            <Footer/>
        </div>
    )
}