import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { Button, ListItem, ListItemButton } from '@mui/material';
import Link from 'next/link';
import { getProfile } from '@/helper/auth/auth';
import { IProfile } from '@/interface/user/user.interface';
import { useRouter } from 'next/navigation';
import { ListIcon, ListOrdered, ShoppingBag } from 'lucide-react';
import { ShoppingBagOutlined } from '@mui/icons-material';

export default function AccountMenu(data: { data: IProfile }) {
  const { status } = useSession();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path: string) => {
    setAnchorEl(null);
    window.location.href = path;
  };

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <Button
            onClick={handleClick}
            startIcon={
              <Avatar
                sx={{ width: 32, height: 32 }}
                src={data.data?.image_url || undefined}
                alt={data.data?.first_name || 'User'}
              />
            }
            sx={{
              ml: 2,
              textTransform: 'none',
              color: 'text.primary',
              fontSize: '12px',
              fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78',
              fontWeight: 400,
            }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            {data.data?.first_name || ''}
          </Button>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => handleMenuItemClick('/profile/profile')}
          sx={{
            fontSize: '14px',
            fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78',
          }}
        >
          <Avatar src={data.data?.image_url || undefined} /> Akun Saya
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuItemClick('/order-list')}
          sx={{
            fontSize: '14px',
            fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78',
          }}
        >
          <ShoppingBagOutlined className="text-primaryText mr-2" /> Pesanan Saya
        </MenuItem>
        <Divider />

        <MenuItem
          onClick={handleClose}
          sx={{
            fontSize: '14px',
            fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78',
          }}
        >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            signOut();
          }}
          sx={{
            fontSize: '14px',
            fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78',
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
