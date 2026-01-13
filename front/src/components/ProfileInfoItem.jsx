  const ProfileInfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center space-x-4 p-4 border-b border-gray-100 last:border-b-0">
      <div className="shrink-0 text-red-500">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-500">{label}</p>
        <p className="text-lg font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );

  export default ProfileInfoItem;