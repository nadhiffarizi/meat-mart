'use client';
import ProductCart from '@/components/Cart/ProductCart.Component';
import { getCartDataAPI, syncCartDataFromAPI } from '@/helper/cart/cart.helper';
import { cartTotalPageAPI } from '@/helper/pagination/pagination.helper';
import { ICart } from '@/interface/cart/cart.interface';
import { PageContext, RefreshContext } from '@/interface/pagination.interface';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { ArrowBack, NavigateBefore, NavigateNext } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  TextField,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

export default function MyCartList({ accessToken }: { accessToken: string }) {
  // page state
  const pageState = React.useContext(PageContext);
  const refreshState = React.useContext(RefreshContext);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const cartState = useAppSelector((state) => state.cartState);
  const [cartViewData, setCartView] = React.useState<ICart[]>([]);
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (
      !accessToken ||
      !pageState?.currentPage ||
      !pageState.pageCount ||
      status === 'loading'
    ) {
      console.log('loading di mycartlist');
      return;
    }

    // set new params
    const params = new URLSearchParams();
    console.log('new page', pageState?.currentPage);

    params.set('page', pageState.currentPage.toString()!);
    router.replace(`${pathname}?${params.toString()}`);

    // get cart view data
    const resCartData = getCartDataAPI(
      'cart/get',
      accessToken,
      pageState?.currentPage,
    );
    resCartData
      .then((v) => v.json())
      .then((value) => {
        setCartView(syncCartDataFromAPI(value['data']));
      });
  }, [pageState?.currentPage, pageState?.pageCount, cartState]);

  return (
    <React.Fragment>
      <Box
        id="mycartList-container"
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: '#F5F5F5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div className="flex flex-col w-full gap-5">
          {cartViewData.map((cartItem: ICart, index: number) => {
            return <ProductCart cartItem={cartItem} key={index} />;
          })}
        </div>
        <div
          id="footer-container"
          className="absolute bottom-0 h-[70px] w-full flex justify-between rounded-md shadow-sm px-4 bg-white"
        >
          <Button
            id="backtoshoping-button"
            style={{ textTransform: 'none' }}
            onClick={() => router.push('./')}
            startIcon={<ArrowBack />}
            className="!text-small !text-secondaryGreen !font-semibold hover:bg-transparent"
          >
            Continue Shopping
          </Button>
          <div className="flex justify-between gap-7 items-center h-full">
            <IconButton
              onClick={() => {
                if (pageState?.currentPage && pageState?.currentPage > 1) {
                  pageState.setCurrentPage(pageState.currentPage - 1);
                }
              }}
              id="backpage-button"
              className="h-[40px]"
            >
              <NavigateBefore />
            </IconButton>
            <IconButton
              onClick={() => {
                if (
                  pageState?.currentPage &&
                  pageState?.currentPage < pageState.pageCount!
                ) {
                  setTimeout(() => {
                    setLoading(true);
                    pageState.setCurrentPage(pageState.currentPage! + 1);
                    setLoading(false);
                  }, 1000);
                }
              }}
              id="nextpage-button"
              className="h-[40px]"
            >
              {isLoading ? (
                <CircularProgress color="inherit" />
              ) : (
                <NavigateNext />
              )}
            </IconButton>
          </div>
        </div>
      </Box>
    </React.Fragment>
  );
}
