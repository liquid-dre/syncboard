import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface User {
	name?: string | null;
	imageUrl?: string | null;
}

interface UserAvatarProps {
	user?: User | null;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user }) => {
	return (
		<div className="flex items-center space-x-2 w-full">
			<Avatar className="h-6 w-6">
				<AvatarImage
					src={user?.imageUrl ?? undefined}
					alt={user?.name ?? "User"}
				/>
				<AvatarFallback className="capitalize">
					{user?.name || "?"}
				</AvatarFallback>
			</Avatar>
			<span className="text-xs text-gray-500">
				{user?.name || "Unassigned"}
			</span>
		</div>
	);
};

export default UserAvatar;
