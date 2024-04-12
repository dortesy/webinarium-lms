import {auth, signOut} from "@/auth"
import {Sidebar} from "@/components/dashboard/sidebar/sidebar"

const SettingsPage = async () => {
    const  session  = await auth()
  return (
      <h1>Главная страница панели управления</h1>
  );
}

export default SettingsPage