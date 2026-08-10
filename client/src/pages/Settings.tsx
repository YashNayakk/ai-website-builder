import { AccountSettings } from "@/components/auth/settings/account/account-settings"
import { ChangePassword } from "@/components/auth/settings/security/change-password"

const Settings = () => {
    return (
        <div className="w-full p-4 flex justify-center items-center min-h-[90vh]
         flex-col gap-6 py-12">
            <AccountSettings
                className="bg-black/10 ring ring-indigo-950 max-w-xl mx-auto"
            />
            <div className="w-full">
                <ChangePassword className="bg-black/10 ring ring-indigo-950 max-w-xl mx-auto" />
            </div>
        </div>
    )
}

export default Settings

// import { ChangePassword } from "@/components/auth/settings/security/change-password"

// export function ChangePasswordDemo() {
//   return (
//     <div className="w-full">
//       <ChangePassword />
//     </div>
//   )
// }