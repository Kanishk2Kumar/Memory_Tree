import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import MobileNavigation from "@/components/MobileNavigation"
import { getCuurentUser } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"

const Layout = async ({children}: {children: React.ReactNode}) => {
    const currentUser = await getCuurentUser();
    if(!currentUser) return redirect("/sign-in");
    
  return (
    <main className='flex h-screen'>
        <Sidebar {...currentUser} />
        <section className='flex h-full flex-1 flex-col'>
          <MobileNavigation {...currentUser} />
          <Header userId={currentUser.$id} accountId={currentUser.accountId} />
            <div className='main-content'>
                {children}
            </div>
        </section>
    </main>
  )
}

export default Layout