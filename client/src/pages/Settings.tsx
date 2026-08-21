import { AccountSettings } from "@/components/auth/settings/account/account-settings"
import { ChangePassword } from "@/components/auth/settings/security/change-password"

const Settings = () => {
    return (
        <div className="w-full p-4 flex justify-center items-center min-h-[90vh] flex-col gap-6 py-12">
            <div className="w-full max-w-xl mx-auto">
                <AccountSettings className="*:bg-black/10 *:ring *:ring-indigo-950 *:rounded-lg *:p-2" />
            </div>

            <div className="w-full max-w-xl mx-auto">
                <ChangePassword className="bg-black/10 ring ring-indigo-950" />
            </div>
        </div>
    )
}

export default Settings