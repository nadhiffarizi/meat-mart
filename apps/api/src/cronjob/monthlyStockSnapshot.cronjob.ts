import cron from 'node-cron';
import { E_StockStatus, PrismaClient } from '@prisma/client';
import { startOfDay } from 'date-fns';

const prisma = new PrismaClient();

async function monthlySnapshotStocks() {
  const allStocks = await prisma.stocks.findMany();

  const snapshots = allStocks.map((stock) => ({
    product_id: stock.product_id,
    store_id: stock.store_id,
    quantity: Number(stock.quantity),
    status: E_StockStatus.SNAPSHOT,
  }));

  await prisma.stockHistory.createMany({
    data: snapshots,
  });
}

function isEndOfMonth(): boolean {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  return tomorrow.getDate() === 1;
}

cron.schedule('59 23 * * *', async () => {
  console.log('Checking if end of month...');

  if (isEndOfMonth()) {
    console.log('End of month detected — running snapshot...');
    await monthlySnapshotStocks();
  } else {
    console.log('Not end of month — skipping snapshot.');
  }
});

console.log('Cron job for snapshots started.');
