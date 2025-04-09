import { E_Role } from "@prisma/client"

export const convertRoleToEnum = (roleString: string) => {
    switch (roleString) {
        case 'ADMIN':
            return E_Role.ADMIN;
        case 'SUPERADMIN':
            return E_Role.SUPER_ADMIN;
        case 'CUSTOMER':
            return E_Role.CUSTOMER
        default:
            return E_Role.CUSTOMER
    }
} 