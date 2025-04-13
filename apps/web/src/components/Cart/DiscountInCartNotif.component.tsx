import { getAvailableDiscountsAPI } from '@/helper/discount.helper';
import { Discount, LocalActivity } from '@mui/icons-material';
import { Button, IconButton, Modal } from '@mui/material';
import * as React from 'react';

export default function DiscountInCartNotif({ cartId }: { cartId: string }) {
  const [isDiscountFound, setDiscountFound] = React.useState<boolean>(false);
  React.useEffect(() => {
    const resGetDiscount = getAvailableDiscountsAPI(
      `/api/discount/get/${cartId}`,
    );

    resGetDiscount
      .then((v) => v.json())
      .then((value) => {
        if (value['data'].length) {
          setDiscountFound(true);
        }
      });
  }, []);

  // handle modal open
  const handleOpen = () => {
    setDiscountFound(true);
  };
  return (
    <div className="w-full h-full">
      {isDiscountFound && (
        <React.Fragment>
          <Button
            style={{ textTransform: 'none' }}
            className="!text-xs
         !text-red-400 "
            startIcon={<Discount />}
          >
            Check Available Discounts
          </Button>
          {/* <Modal
            open={open}
            onClose={handleOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Text in a modal
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography>
            </Box>
          </Modal> */}
        </React.Fragment>
      )}
    </div>
  );
}
