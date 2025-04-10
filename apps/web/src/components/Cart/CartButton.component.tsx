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
import { ShoppingCart } from '@mui/icons-material';
import { useAppSelector } from '@/redux/store';
import { useState, useEffect } from 'react';
import { countTotalInCart } from '@/helper/cart.helper';
import CartCard from './CartCard.component';
import { ICart } from '@/interface/cart.interface';
import { useRouter } from 'next/navigation';

export default function CartButtonNavbar() {
  //global state
  const cartState = useAppSelector((state) => state.cartState);
  const [totalCartQtty, setCartQtty] = useState<number>();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const router = useRouter();

  const handleClose = () => {
    setAnchorEl(null);
  };

  //when component renders
  useEffect(() => {
    const totalQtty = countTotalInCart(cartState);
    setCartQtty(totalQtty);
  }, [cartState]);

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Cart">
          <Button
            onClick={handleClick}
            className="relative !bg-slate-50 hover:!bg-slate-200 !rounded-full"
            sx={{
              width: '50px',
              height: '50px',
            }}
            startIcon={
              <ShoppingCart
                width={14}
                height={14}
                className=" text-orangeAccent cursor-pointer "
              ></ShoppingCart>
            }
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <div className=" text-base text-secondaryText">{totalCartQtty}</div>
          </Button>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="cart-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              width: '300px',
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
        <div className="flex flex-col gap-3 w-full max-h-[300px] overflow-auto py-5 px-5  ">
          {cartState.map((cartItem: ICart, index: number) => {
            return <CartCard cartItem={cartItem} key={index} />;
          })}
        </div>

        {/**button for view all */}
        {cartState.length === 0 ? (
          <div className="flex w-full h-1/2 justify-center">
            <p>You have no item in cart</p>
          </div>
        ) : (
          <></>
        )}

        <div className="w-full h-3 bg-transparent"></div>
        <div className="flex w-full h-[60px] py-2 justify-center">
          <Button
            onClick={() => {
              handleClose();
              router.push('/cart');
            }}
            className="!w-[90%] !bg-secondaryGreen !h-full !rounded-3xl !text-white hover:"
            sx={{
              fontSize: '14px',
              fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78',
            }}
          >
            View Cart
          </Button>
        </div>
      </Menu>
    </React.Fragment>
  );
}
