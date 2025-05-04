import { signOut, useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
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
import { Button } from '@mui/material';
import Link from 'next/link';
import { getProfile } from '@/helpers/handlers/auth';
import { IProfile } from '@/interfaces/card.interface';
import { useRouter } from 'next/navigation';

export default function AccountMenu() {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log('Session data:', session);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [profile, setProfile] = useState<IProfile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        if (status === 'authenticated' && session.user?.email) {
          {
            const data = await getProfile(session.user.email);
            // console.log('GET PROFILE', data);
            setProfile(data);
            // if (data.image_url) {
            //   setImagePreview(data.image_url);
            // }
          }
        }
      } catch (err) {
        //setError(err instanceof Error ? err.message : 'Failed to load profile');
        console.error('Profile load error:', err);
      }
    }

    loadProfile();
  }, [status, session]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
                src={profile?.image_url || undefined}
                alt={profile?.first_name || 'User'}
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
            {profile?.first_name || ''}
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
          onClick={handleClose}
          component={Link}
          href="/profile/profil"
          sx={{
            fontSize: '14px',
            fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78',
          }}
        >
          <Avatar src={profile?.image_url || undefined} /> Profile
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          sx={{
            fontSize: '14px',
            fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78',
          }}
        >
          <Avatar src={profile?.image_url || undefined} /> My account
        </MenuItem>
        <Divider />
        {/* <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem> */}
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
          onClick={() => signOut()}
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
