'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/helper/api';
import { DataTable } from './DataTable';
import { columns } from './columns';
import { useSession } from 'next-auth/react';
import { StockHistory } from './columns';
import {
  IGetStockHistory,
  IGetStockHistoryRange,
} from '@/interface/stockHistory/stockHistory.interface';
import dayjs from 'dayjs';

interface IDropDownOptions {
  value: Date;
  label: string;
}

function ViewStockHistoryReport({
  productId,
  storeId,
}: {
  productId: string;
  storeId: string;
}) {
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);
  const [dropDownOptions, setDropDownOptions] = useState<IDropDownOptions[]>(
    [],
  );
  const [month, setMonth] = useState(dayjs().format('MM'));
  const [year, setYear] = useState(dayjs().format('YYYY'));
  const { data: session } = useSession();

  useEffect(() => {
    async function getStockHistoryRange() {
      try {
        const response = await api(
          `stockHistory/range?storeId=${storeId}&productId=${productId}`,
          'GET',
          {},
          session?.user.access_token,
        );
        const { earliestRecord } = response.data as IGetStockHistoryRange;
        const earliestDate = dayjs(new Date(earliestRecord.created_at)).startOf(
          'month',
        );
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

    getStockHistoryRange();
  }, [session?.user.access_token, productId, storeId]);

  useEffect(() => {
    async function getStockHistory() {
      try {
        const response = await api(
          `stockHistory/all?storeId=${storeId}&productId=${productId}&month=${month}&year=${year}`,
          'GET',
          {},
          session?.user.access_token,
        );
        setStockHistory(response.data as StockHistory[]);
      } catch (error: any) {
        console.error('Error fetching stock history:', error);
      }
    }

    if (month && year) getStockHistory();
  }, [session?.user.access_token, productId, storeId, month, year]);

  return (
    <>
      <select
        value={dayjs(`${year}-${month}-01`).toISOString()}
        onChange={(e) => {
          const selectedDate = dayjs(e.target.value);
          setMonth(selectedDate.format('MM'));
          setYear(selectedDate.format('YYYY'));
        }}
        className="w-full max-w-xs px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 text-sm bg-white text-gray-900"
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

      <DataTable columns={columns} data={stockHistory} />
    </>
  );
}

export default ViewStockHistoryReport;
