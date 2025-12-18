import React from "react";
import { User, Mail, Calendar } from "lucide-react";
import Layout from "../components/ui/Layout";
import useAuthContext from "../context/auth";
import { formatDate } from "../utils";

const Profil = () => {
  const { user } = useAuthContext();

  const formattedDate = formatDate(user.createdAt);

  const ProfileInfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-4 p-4 border-b border-gray-100 last:border-b-0">
      <div className="shrink-0 text-red-500">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-500">{label}</p>
        <p className="text-lg font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
      <div className="flex justify-center p-8 bg-gray-50 min-h-[50vh]">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl">
          <div className="p-6 bg-red-400 text-white text-center rounded-t-xl">
            <User className="w-12 h-12 mx-auto mb-2" />
            <h2 className="text-2xl font-bold">{user.pseudo}</h2>
          </div>

          <div className="p-6 divide-y divide-gray-100">
            <ProfileInfoItem
              icon={Mail}
              label="Adresse Email"
              value={user.email}
            />

            <ProfileInfoItem icon={User} label="Pseudo" value={user.pseudo} />

            <ProfileInfoItem
              icon={Calendar}
              label="Membre depuis le"
              value={formattedDate}
            />
          </div>
        </div>
      </div>
  );
};

export default Profil;
