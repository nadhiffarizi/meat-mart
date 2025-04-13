import { Box, Modal, Typography } from '@mui/material';
import * as React from 'react';

export default function DiscountModalInCart() {
  return (
    <Box>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Text in a modal
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      </Typography>
    </Box>
  );
}
