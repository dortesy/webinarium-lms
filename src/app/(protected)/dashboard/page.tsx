import {auth, signOut} from "@/auth"


const SettingsPage = async () => {
    const  session  = await auth()
  return (
    <div>
      <h1>Settings</h1>
        This page is protected by the auth middleware. You can see how it works in
          {JSON.stringify(session)}
        <code>app/_middleware/auth.ts</code>

          <form action={async () => {
              "use server"
              await signOut()
          }}>
              <button type="submit">Sign Out</button>

          </form>
    </div>
  );
}

export default SettingsPage