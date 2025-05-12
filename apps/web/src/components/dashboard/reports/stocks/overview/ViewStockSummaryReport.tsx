'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/helper/handlers/api';
import { DataTable } from './DataTable';
import { columns } from './columns';
import { useSession } from 'next-auth/react';
import { StockSummary } from './columns';
import {
  IGetStockHistory,
  IGetStockHistoryRange,
} from '@/interface/stockHistory.interface';
import dayjs from 'dayjs';
import { IGetStores } from '@/interface/store.interface';

interface IDropDownOptions {
  value: Date;
  label: string;
}

function ViewStockSummaryReport({ storeId }: { storeId: string }) {
  const [allStockSummary, setAllStockSummary] = useState<StockSummary[]>([]);
  const [dropDownOptions, setDropDownOptions] = useState<IDropDownOptions[]>(
    [],
  );
  const [month, setMonth] = useState(dayjs().format('MM')); // e.g. "05"
  const [year, setYear] = useState(dayjs().format('YYYY')); // e.g. "2025"
  const { data: session } = useSession();

  // Generate dropdown options from earliest record to current month
  useEffect(() => {
    async function getStoreCreatedAt() {
      try {
        const response = await api(
          `store?id=${storeId}`,
          'GET',
          {},
          session?.user.access_token,
        );
        const { created_at } = response.data as IGetStores;
        const earliestDate = dayjs(new Date(created_at)).startOf('month');
        const currentMonth = dayjs().startOf('month');
        const options: IDropDownOptions[] = [];

        let date = earliestDate;
        while (date.isBefore(currentMonth) || date.isSame(currentMonth)) {
          options.push({
            value: date.toDate(),
            label: date.format('MMMM YYYY'),
          });
          date = date.add(1, 'month');
        }

        setDropDownOptions(options);
      } catch (error: any) {
        console.error('Error fetching stock history range:', error);
      }
    }

    getStoreCreatedAt();
  }, [session?.user.access_token, storeId]);

  // Fetch stock history for selected month/year
  useEffect(() => {
    async function getAllStockSummary() {
      try {
        const response = await api(
          `stock/summary?storeId=${storeId}&month=${month}&year=${year}`,
          'GET',
          {},
          session?.user.access_token,
        );
        setAllStockSummary(response.data as StockSummary[]);
      } catch (error: any) {
        console.error('Error fetching stock history:', error);
      }
    }

    if (month && year) getAllStockSummary();
  }, [session?.user.access_token, storeId, month, year]);

  return (
    <>
      <select
        value={dayjs(`${year}-${month}-01`).toISOString()}
        onChange={(e) => {
          const selectedDate = dayjs(e.target.value);
          setMonth(selectedDate.format('MM')); // "05"
          setYear(selectedDate.format('YYYY')); // "2025"
        }}
      >
        {dropDownOptions.map((dropDownOption) => (
          <option
            key={String(dropDownOption.value)}
            value={dayjs(dropDownOption.value).toISOString()}
          >
            {dropDownOption.label}
          </option>
        ))}
      </select>

      <DataTable columns={columns} data={allStockSummary} />
    </>
  );
}

export default ViewStockSummaryReport;
